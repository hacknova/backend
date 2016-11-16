/**
 * Event endpoint
 **/

'use strict';

const debug = require('debug')('backend:route:event');

module.exports = (Router, config, data) =>{

  Router.get('/', (req, res) => {
      return res.send(config.event);
  })

  return Router;
}
