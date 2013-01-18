exports.settings = {
  twilio: {
    user: '', // Twilio Account key
    key: '', // Twilio auth token
    from: '', // Twilio phone number
    to: [''] // List of phone numbers twilio is able to interact with
  },

  /*
   * A list of what notifications to run when a webhook is received.
   * Currently the supported notification types are:
   *  - twiliosms
   */
  notifications: ['twiliosms']
};
