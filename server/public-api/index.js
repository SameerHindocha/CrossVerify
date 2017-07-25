/*
 Endpoints which don't require authentication
 */
let byPassedEndpoints = [
  '/client',
  '/gst-status',
  '/user-data',

];

let fs = require('fs');
module.exports = class PublicApis {
  constructor(app) {
    app.use('/public-api', (req, res, next) => {
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