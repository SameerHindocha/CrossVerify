let config = require('./development.js');
let fs = require('fs');
let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

let mongo = {
  dbHost: config.mongo.dbHost,
  dbName: config.mongo.dbName,
  dbUser: config.mongo.dbUser,
  dbPassword: config.mongo.dbPassword
};

global.mongoose = mongoose;
let mongodbUri = require('mongodb-uri');

let options = {
  db: { native_parser: true, numberOfRetries: 100, retryMiliSeconds: 60000 },
  server: { auto_reconnect: true, poolSize: 10, socketOptions: { keepAlive: 1 } },
  debug: true
};

if (mongo.replset !== undefined) {
  options.replset = {
    rs_name: mongo.replset,
    safe: true
  };
}

let uri = mongodbUri.format({
  username: mongo.dbUser,
  password: mongo.dbPassword,
  hosts: mongo.dbHost,
  database: mongo.dbName,
  options: {}
});

mongoose.connect(uri, options);
mongoose.set('debug', config.mongo.debug);
db = {};

fs.readdirSync(ROOT_PATH + '/models').filter(function(file) {
  let stats = fs.statSync(ROOT_PATH + '/models/' + file);
  return (file.indexOf('.') !== 0 && !stats.isDirectory());
}).forEach(function(file) {
  let temp = require(ROOT_PATH + '/models/' + file)(mongoose);
  db[temp.modelName] = temp;
});
