# cm-webhook

This is a small web app that you can point your [Rackspace Cloud Monitoring](http://www.rackspace.com/cloud/monitoring/)
webhook notifications at. The app then turns that webhook into various types of notifications. Currently the following services
are supported:
 * [Twilio](http://www.twilio.com) SMS
 * [PagerDuty](http://www.pagerduty.com)

## Notifications
### Twilio SMS
This notification will send an SMS for every alarm sent by Cloud Monitoring to a list of phone numbers.

### PagerDuty
Using PagerDuty, this will create a new issue for CRITICAL and WARNING alarms. It will then attempt to resolve the issue
if an OK is received from Cloud Monitoring.

## TODO
 * Don't require dependencies for notification types not being used
 * Lots of other things

## Requirements
 * node
 * redis (For Pagerduty)
