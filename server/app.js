const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
let app = express();
global.ROOT_PATH = __dirname;
const config = require('./config/development.js');
global.config = config;
global.preLink = `http://${global.config.server.url}:${global.config.server.port}/#/client/add`;
const path = require('path');
const fs = require('fs');

let sessionOptions = {
  name: 'cv.session', //cookie name (formerly known as key).
  secret: 'SpcvTrsPOTms', // session cookie is signed with this secret to prevent tampering.
  resave: true, // forces session to be saved even when unmodified.
  saveUninitialized: false, //forces a session that is "uninitialized" to be saved to the store.A session is uninitialized when it is new but not modified.
  rolling: false, //forces a cookie set on every response.This resets the expiration date.
  cookie: {
    path: "/",
    httpOnly: true,
    maxAge: 86400000, //24 hr
    httpOnly: true,
    secure: false,
  }
};

app.use(session(sessionOptions));
app.use("/", express.static(path.join(ROOT_PATH, '..', 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./config/mongo');

let adminAPI = require('./admin-api');
new adminAPI(app);
let publicAPI = require('./public-api');
new publicAPI(app);

module.exports = app;