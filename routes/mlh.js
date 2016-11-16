/**
 * Attending endpoint
 **/

'use strict';

const debug = require('debug')('backend:route:mlh');

module.exports = (Router, config, data) =>{
  let hn    = data.hn;

  Router.post('/me', (req, res) => {
    let access_token = req.body.access_token

    // Validate Input
    if(!access_token || access_token === '') return res.error('EMPTY_ACCESS_TOKEN');

    hn._getUser(access_token, (err, data) => {
      if(err) return res.error(err);

      if(typeof data !== 'object') return res.error('INVALID_RESPONSE');
      if(!data.data) return res.error('INVALID_RESPONSE_INNER');

      // remove scopes info, incase that's vulnerable.
      delete data.data.scopes;

      return res.send(data.data);
    })
  })

  return Router;
}
