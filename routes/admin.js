/**
 * Admin Endpoint
 **/

'use strict';

const debug = require('debug')('backend:route:auth');
const fs    = require('fs');
const path  = require('path');

module.exports = (Router, config, data) =>{
  let auth = data.auth;

  /**
   * Designate a user as admin via access_token
   **/
  Router.post('/init', (req, res) => {
    let initfile = path.join(__dirname, '../', '.not-init');

    // check mem to see if init or not.
    if(!config.init) return res.error('NOT_INIT');

    let access_token = req.body.access_token;
    if(!access_token || access_token === '') return res.error('EMPTY_ACCESS_TOKEN');

    auth.generate(access_token, (err, resp) => {
      if(err) return res.error(err);

      // invalidate init endpoint
      fs.writeFile(initfile, 'true', err => {
        if(err) return res.error('INIT_UNSECURED')

        return res.success(resp);
      })
    })
  })

  /**
   * Designate a user as an admin via user id.
   **/
  Router.post('/by-id/:id', (req, res) => {
    return res.error('NOT_IMPLEMENTED');
  })

  /**
   * Get a User's token.
   **/
  Router.get('/me', (req, res) => {
    let access_token = req.query.access_token;
    if(!access_token || access_token === '') return res.error('EMPTY_ACCESS_TOKEN');

    auth.get(access_token, (err, resp) => {
      if(err) return res.error(err);

      return res.success(resp);
    })
  });

  /**
   * Check if an token is valid.
   **/
  Router.post('/valid', (req, res) => {
    let token = req.body.token;
    if(!token || token === '') return res.error('EMPTY_TOKEN');

    auth.validate(token, (err, resp) => {
      if(err) return res.error(err);

      return res.success(resp);
    })
  })

  return Router;
}
