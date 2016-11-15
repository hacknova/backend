/**
 * Configuration File.
 *
 * Tweak as needed.
 **/
module.exports = {
  /**
   * MyMLH Information
   * Required.
   **/
  "mymlh": {
    "id": "",
    "secret": "",
    "redirect_uri": ""
  },

  /**
   * Internal Authentication
   **/
  "auth": {
    "public": "",
    "secret": ""
  },

  "server": {
    "port": 8081
  },

  /**
   * Event Settings
   **/
  "event": {
    "name": "HackNova",
    "limit": 100 // Limit to 100 people.
  },

  /**
   * Database Information (ArangoDB)
   **/
  "db": {
    "host": "127.0.0.1",
    "port": 8529,
    "name": "triton",
    "user": "root",
    "password": "",
    "name": "name",

    "collections": [
      "users"
    ]
  },

  /**
   * Sendgrid Intergration
   **/
  "sendgrid": {
    "enabled": true,
    "apikey": "",
    "registration_template_id": '652e9e89-9cdf-49a9-9e69-f73987ff5d6a',
    "from": {
      "name": 'Jared @ HackNova',
      "email": 'president@hacknova.co'
    }
  },

  /**
   * Sentry Intergration
   **/
  "sentry": {
    "enabled": true
  },

  /**
   * Slack Notifications
   *
   * Setup an incoming webhook (https://hacknova.slack.com/services/B33JH5FDM)
   **/
  "slack": {
    "enabled": true,
    "webhook": ""
  }
}
