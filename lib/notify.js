var async = require('async');

var settings = require('../settings').settings;
var twilio = require('twilio');

var notifications = {
  twiliosms: function(msg, callback) {
    var twClient = new twilio.RestClient(settings.twilio.user, settings.twilio.key);

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

exports.notify = function(msg) {
  async.forEach(settings.notifications, function(notification, callback) {
    notifications[notification](msg, callback);
  });
}
