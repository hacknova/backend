/**
 * Attending endpoint
 **/

'use strict';

const debug = require('debug')('backend:route:attending');

module.exports = (Router, config, data) =>{
  let hn    = data.hn;
  let sg    = data.sg;
  let slack = data.slack;

  /**
   * Get who's attending.
   **/
  Router.get('/', (req, res) => {
    hn.get((err, data) => {
      if(err) return res.error(err);

      let final_data = data.map(val => {
        return val.data_wrapper;
      })

      return res.success(final_data)
    });
  });

  /**
   * Register a user as attending.
   **/
  Router.post('/', (req, res) => {
    debug('access_token', req.body.access_token)
    if(!req.body.access_token) return res.error('EMPTY_ACCESS_TOKEN');

    hn.addUser(req.body.access_token, (err, data) => {
      if(err) return res.error(err);

      // Send registration e-mail, w/o care for success.
      debug('registration', 'sending e-mail')
      sg.registered(data, data.email);

      debug('slack', 'sending notification');
      slack.notify(`${data.first_name} ${data.last_name} (${data.email}) just registered!`)

      return res.success('REGISTERED')
    });
  })

  return Router;
}
