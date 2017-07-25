/*
 Endpoints which don't require authentication
 */
let byPassedEndpoints = [
  '/admin-api',
  '/user',
  '/share-form',
  '/send-sms',
  '/checkLogin',
  '/login',
  '/logout',
  '/gst-status',
  '/compare-file',
  '/edit-user'
];

let fs = require('fs');
module.exports = class AdminApis {
  constructor(app) {
    // Configure local auth check
    app.use('/admin-api', (req, res, next) => {
      byPassedEndpoints.forEach(function(path) {
        let regex = new RegExp(path, 'i');
        if (req.path.match(regex)) {
          next();
        }
      });
    });
    this.setupRoutes(app);
  }
  setupRoutes(app) {
    fs.readdirSync(__dirname + '/').filter(function(file) {
      const stats = fs.statSync(__dirname + '/' + file);
      return (file.indexOf('.') !== 0 && stats.isDirectory());
    }).forEach(function(file) {
      let tmpRoute = require(__dirname + '/' + file);
      new tmpRoute(app);
    });
  }
};