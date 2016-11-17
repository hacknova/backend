/**
 * Event endpoint
 **/

'use strict';

const debug = require('debug')('backend:route:event');

module.exports = (Router, config, data) =>{
  let auth = data.auth;

  Router.get('/', auth.express(), (req, res) => {
      return res.send(config.event);
  })

  return Router;
}
