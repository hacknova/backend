/**
 * Authentication Handler
 *
 * @author Jared Allard <jaredallard@outlook.com>
 * @license MIT
 * @version 1.0.0
 **/

'use strict';

const crypto = require('crypto');
const debug  = require('debug')('backend:auth');
const path   = require('path');
const fs     = require('fs');
const async  = require('async');

/**
 * Authentication Class.
 *
 * @class Auth
 **/
class Auth {
  constructor(config, db, hn) {
    // Setup Auth
    this.config = config;
    this.hn     = hn;
    this.db     = db;
  }


  /**
   * Generate Authentication for a user
   *
   * @param {Function} done - callback.
   * @returns {undefined} use callback.
   **/
  generate(access_token, done) {
    let auth = crypto.randomBytes(64).toString('hex');

    async.waterfall([
      /**
       * Get User Information
       **/
      (next) => {
        this.hn._getUser(access_token, (err, data) => {
          if(err) return done(err);

          if(typeof data !== 'object') return next('INVALID_RESPONSE');
          if(!data.data) return next('INVALID_RESPONSE_INNER');

          return next(false, data.data);
        })
      },

      /**
       * Check if Already an Admin
       **/
      (user, next) => {
        this.db.search('admins', 'user_id', user.id)
        .catch(done)
        .then(resp => {
          if(!resp || !resp[0]) return next(false, user);

          // default fail
          return next('ALREADY_ADMIN');
        })
      }
    ], (err, user) => {
      if(err) return done(err);

      // Post the new admin to the DB.
      this.db.post('admins', {
        user: user,
        user_id: user.id,
        token: auth,
        created: Date.now(),
        valid: true
      }).catch(done).then(() => {

        // Return the token.
        return done(false, {
          token: auth
        });
      })
    })
  }

  /**
   * Get Authentication from access_token
   *
   * @param {String} access_token - access_token from MyMLH
   * @param {Function} done - callback.
   * @returns {undefined} use callback.
   **/
  get(access_token, done) {
    async.waterfall([
      /**
       * Get User Information
       **/
      (next) => {
        this.hn._getUser(access_token, (err, data) => {
          if(err) return done(err);

          if(typeof data !== 'object') return next('INVALID_RESPONSE');
          if(!data.data) return next('INVALID_RESPONSE_INNER');

          return next(false, data.data);
        })
      },

      /**
       * Check if Already an Admin
       **/
      (user, next) => {
        this.db.search('admins', 'user_id', user.id)
        .catch(done)
        .then(resp => {
          if(!resp || !resp[0]) return next('NOT_ADMIN');

          return next(false, resp[0].token);
        })
      }
    ], (err, auth) => {
      if(err) return done(err);

      return done(false, {
        token: auth
      });
    });
  }

  /**
   * Validate an token
   *
   * @param {String} token - token to validate.
   * @param {Function} done - callback
   * @returns {undefined} nothing to return
   **/
  validate(token, done) {
    this.db.search('admins', 'token', token)
    .catch(done)
    .then(resp => {
      console.log(resp);
      if(!resp || !resp[0]) return done('INVALID_TOKEN');

      let token_object = resp[0];

      // Check if token is still valid.
      if(!token_object.valid) return done('INVALID_TOKEN');

      return done(false, token_object)
    })
  }

  /**
   * Create an Express Middleware.
   *
   * @returns {Function} middleware.
   **/
  express() {

    // Return a express middleware.
    return (req, res, next) => {
      let auth = req.body.auth || req.query.auth || req.get('Authentication');

      if(!auth) return res.error('EMPTY_TOKEN')

      this.validate(auth, (err, data) => {
        if(err) return res.error(err);

        // set user object.
        req.user = data.user;

        // keep going
        return next();
      })
    }
  }
}

module.exports = Auth;
