/**
 * HackNova Abastraction Layer.
 *
 * @author Jared Allard <jaredallard@hacknova.co>
 * @license MIT
 * @version 1.0.0
 **/

'use strict';

const debug = require('debug')('backend:hn');
const async = require('async');

class HN {
  constructor(db, mlh, config) {
    debug('constructed');

    this.db  = db;
    this.mlh = mlh;
    this.c   = config;
  }

  /**
   * Get a list of user's coming.
   **/
  get(done) {
    this.db.all('users')
    .catch(done).then(data => {
      return done(false, data);
    })
  }

  /**
   * Add a user to the "attending" via access_token.
   **/
  addUser(access_token, done) {
    async.waterfall([
      // Check limit
      next => {
        this._checkLimit(next);
      },

      // Get user via access_token
      next => {
        this._getUser(access_token, next)
      },

      // Check if the user already exists,
      (res, next) => {
        this.getUser(res.data.id, err => {
          if(!err) return next('ALREADY_REGISTERED');

          debug('AddUser', 'adding to hackathon')
          return next(false, res)
        });
      },

      // Add the user to the database.
      (res, next) => {
        this._addUser(res.data, err => {
          return next(err, res);
        });
      }
    ], (err, res) => {
      if(err) return done(err);
      if(!err) debug('AddUser', `${res.data.id} (${res.data.first_name} ${res.data.last_name}) added`)

      let rtr = null;
      if(typeof res === 'object') rtr = res.data;
      return done(err, rtr);
    })
  }

  /**
   * Get a User (database)
   **/
  getUser(id, done) {
    this.db.search('users', 'id', id)
    .catch(done)
    .then(vals => {
      let data = vals[0];

      debug('getUser', id)
      if(!data) {
        debug('getUser', 'not found');
        return done(true);
      }

      debug('getUser', 'found', id);
      return done(false, data);
    })
  }

  /**
   * Add a user (database)
   **/
  _addUser(data, done) {
    debug('_addUser', data.id)
    this.db.post('users', { // Save minimal info, rely on API for truth.
      id:         data.id,
      email:      data.email,
      first_name: data.first_name,
      last_name:  data.last_name
    }).then(() => {
      return done(false);
    }).catch(done);
  }

  /**
   * Check to make sure limit hasn't been hit.
   **/
  _checkLimit(done) {
    this.db.count('users')
    .catch(done).then(count => {
      count = count.count;

      debug('checkLimit', count);
      // if under or equal to limit, OK.
      if(count <= this.c.event.limit) return done(false);

      // if false, not OK.
      return done('OVER_LIMIT');
    })
  }

  /**
   * Verify, and retrive infomation about a user.
   **/
  _getUser(access_token, done) {
    this.mlh.get('/user', {
      authenticated: access_token
    }, (err, body) => {
      if(err) return done(true);

      if(body.status === 'error') return done(body.error.message);

      return done(false, body);
    })
  }

}

module.exports = HN;
