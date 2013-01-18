var async = require('async');
var sprintf = require('sprintf').sprintf;
var twilio = require('twilio');

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
  }
};

exports.notify = function(data) {
  async.forEach(settings.notifications, function(notification, callback) {
    notifications[notification](data, callback);
  });
}
