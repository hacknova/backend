/**
 * MyMLH API Wrapper
 **/

'use strict';

const request = require('request');
const debug   = require('debug')('backend:mymlh');

class MyMLH {
  constructor(url) {
    this.url = url || 'https://my.mlh.io/api/v2';
  }

  /**
   * High Level
   **/
  users(cb) {
    this.get('/users', {
      authenticated: 'application'
    }, cb);
  }

  /**
   * Low level
   **/

  setAuth(id, secret) {
    return this.auth = {
      client_id: id,
      secret: secret
    };
  }

  /**
   * Request an endpoint.
   **/
  request(method, endpoint, options, callback) {
    endpoint = endpoint.replace(/^\//, '');
    method   = method.toUpperCase();


    let url      = `${this.url}/${endpoint}`;
    const params = options.data || {};

    let isJson = false;
    let data   = null;

    // Setup for POST JSON.
    if(method === 'POST' && params) {
      isJson   = true;
      data     = params;
    }

    // Client and User Authentication.
    if(options.authenticated === 'application') {
      debug(method, endpoint, 'NOTICE attaching client auth.')
      params['client_id']    = this.auth.client_id;
      params['secret']       = this.auth.secret;
    } else if(options.authenticated) {
      debug(method, endpoint, 'NOTICE attaching user auth (token)')
      params['access_token'] = options.authenticated;
    }

    // Setup for GET params.
    if(method === 'GET' && params) {
      let str = '';
      for (let key in params) {
          if (str != '') {
              str += '&';
          }
          str += key + '=' + encodeURIComponent(params[key]);
      }

      // Append get params onto URL.
      url = `${url}?${str}`;
    }

    debug(method, endpoint);
    request({
      method: method,
      url: url,
      body: data,
      json: isJson,
      gzip: true
    }, (err, res, body) => {
      debug(method, endpoint, 'resp:', err, body);

      if(typeof body !== 'object') body = JSON.parse(body);

      if(callback) return callback(err, body);
    })
  }

  /**
   * GET Method Wrapper for Request
   **/
  get(endpoint, options, cb) {
    return this.request('GET', endpoint, options, cb);
  }

  /**
   * POST method wrapper for request
   **/
  post(endpoint, options, cb) {
    return this.request('POST', endpoint, options, cb);
  }
}

module.exports = MyMLH;
