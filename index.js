/**
 * HackNova Backend!
 *
 * @author Jared Allard <jaredallard@outlook.com>
 * @license MIT
 * @version 1.0.0
 **/

const express = require('express');
const fs      = require('fs');
const path    = require('path');
const bodyP   = require('body-parser');
const Slack   = require('node-slackr');
const cors    = require('cors');

// Our Stuff
const MyMLH   = require('./lib/mymlh.js');
const Db      = require('./lib/db.js');
const Hn      = require('./lib/hn.js');
const resp    = require('./lib/response.js');
const SendGrd = require('./lib/email.js');


// Config
const config  = require('./config.js');

/**
 * PRE INIT
 **/

// Setup Our Libs.
let mlh       = new MyMLH();
let db        = new Db(config);
let hn        = new Hn(db, mlh, config);
let sg        = new SendGrd(config);

// Set auth for MLH lib
mlh.setAuth(config.mymlh.id, config.mymlh.secret);

let slack = new Slack(config.slack.webhook, {
  channel:  '#general',
  username: 'registr',
  icon_emoji: ':book:'
});

// Data to pass to all routes.
let data = {
  mlh: mlh,
  hn:  hn,
  db:  db,
  sg:  sg,
  slack: slack
}

// Init the database, don't care much about state.
db.init(() => {});

/**
 * WEB SERVER INIT
 **/

// Setup the web server.
let app = express();
app.use(bodyP.json());
app.use(resp())
app.use(cors())

// load our routes.
let ropath = path.join(__dirname, 'routes');
let routes = fs.readdirSync(ropath);
routes.forEach(Route => {
  let route    = path.join(ropath, Route);
  let name     = path.parse(Route).name;
  let router   = express.Router();
  let newroute = require(route);

  // Instance the new router.
  let final    = newroute(router, config, data);

  // Load the new router.
  app.use(`/v1/${name}`, final);
})

app.listen(config.server.port);
