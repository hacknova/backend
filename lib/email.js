/**
 * Send E-Mails via sendgrid.
 *
 **/

'use strict';

const sendgrid = require('sendgrid')
const debug    = require('debug')('backend:email')

/**
 * Email sender.
 * @class SendGrid
 **/
class SendGrid {
  constructor(config) {
    this.sg = sendgrid(config.sendgrid.apikey);
    this.config = config;
  }

  /**
   * Send a Email.
   **/
  _send(to, data, tid) {
    if(!this.config.sendgrid.enabled) {
      debug('_send', 'emulating send, enabled false.')
      return; // emulate sending e-mail.
    }

    // To Field
    if(!data.to) {
      data.to = [
        {
          email: to
        }
      ];
    }

    // Substitutions.
    if(!data.substitutions) {
      data.substitutions = {
        '-hackathon-': this.config.event.name,
        '-name-': data.first_name,
        '-subject-': data.subject || 'Hello!'
      };
    }

    return this.sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
        from: this.config.sendgrid.from,
        personalizations: [
          data
        ],
        template_id: tid
      }
    });
  }

  registered(data, to) {
    debug('registered', data, to);
    debug('registered', this.config.sendgrid.registration_template_id)
    let request = this._send(to, {
      subject: 'You\'re registered!',
      first_name: data.first_name
    }, this.config.sendgrid.registration_template_id);

    debug('registered', 'send request')
    this.sg.API(request, function(error, response) {
      if (error) {
        console.log('Error response received');
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
        return;
      }

      debug('registered', 'sent to', to);
    });
  }
}

module.exports = SendGrid;
