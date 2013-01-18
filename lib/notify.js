var async = require('async');
var sprintf = require('sprintf').sprintf;
var twilio = require('twilio');
var pagerduty = require('pagerduty');
var redis = require('redis');

var settings = require('../settings').settings;

var notifications = {
  twiliosms: function(data, callback) {
    var twClient = new twilio.RestClient(settings.twilio.user, settings.twilio.key);
        entityName = data.entity.label,
        state = data.details.state,
        status = data.details.status,
        target = data.details.target,
        msg = sprintf('%s(%s) is %s. %s', entityName, target, state, status);

    async.forEach(settings.twilio.to, function(toNumber, callback) {
      twClient.sendSms({
        to: toNumber,
        from: settings.twilio.from,
        body: msg
      }, function(err, responseData) {
        if (err) {
          callback(err);
        }

        console.log("Sending SMS notification from " + responseData.from + " to " + responseData.to);
        callback();
      });
    }, callback);
  },

  pagerduty: function(data, callback) {
    var pd, redisClient, alarmKey;

    redisClient = redis.createClient();

    redisClient.on('error', function(err) {
      console.log("Error: " + err);
      callback();
      return;
    });

    pd = new pagerduty({
      serviceKey: settings.pagerduty.serviceKey
    });

    alarmKey = data.event_id.split(':').slice(0, 4).join(":") + ":incident";

    if (data.details.state === 'OK') {
      redisClient.get(alarmKey, function(err, reply) {
        if (err) {
          console.log("Error: " + err);
          callback();
          return;
        }

        pd.resolve({
          incidentKey: reply,
          description: data.details.status,
          details: {
            entity: data.entity,
            check: data.check,
            alarm: data.alarm
          },
          callback: function(err, res) {
            if (err) {
              callback(err);
              return;
            }

            redisClient.del(alarmKey);
            redisClient.quit();
            callback();
          }
        });
      });
    } else {
      pd.create({
        description: data.details.status,
        details: {
          entity: data.entity,
          check: data.check,
          alarm: data.alarm
        },
        callback: function(err, res) {
          if (err) {
            callback(err);
            return;
          }

          redisClient.set(alarmKey, res.incident_key);
          redisClient.quit();
          callback();
        }
      });
    }
  }
};

exports.notify = function(data) {
  async.forEach(settings.notifications, function(notification, callback) {
    notifications[notification](data, callback);
  });
}
