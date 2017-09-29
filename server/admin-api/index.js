/*
 Endpoints which don't require authentication
 */
let byPassedEndpoints = [
  '/admin-api',
  '/user',
  '/send-mail',
  '/send-sms',
  '/checkLogin',
  '/login',
  '/logout',
  '/gst-status',
  '/edit-user',
  '/filter-invoices-by-month',
  '/update-contact-detail',
  '/update-sale-file',
  '/update-purchase-file',
  '/change-sale-status',
  '/change-purchase-status',
  '/self-verify',
  '/update-client-info',
  '/send-confirmation-mail',
  '/send-confirmation-sms',
  '/post-file-data',
  '/read-file-data',
  '/send-otp-sms',
  '/send-otp-email',
  '/send-monthly-mail',
  '/send-monthly-sms',
  '/check-user',
  '/check-receiver',
  '/change-sale-status-by-mail',
  '/change-purchase-status-by-mail',
  '/auto-verify-sale',
  '/auto-verify-purchase',
  '/send-all-monthly-mail',
  '/send-all-monthly-sms',
  '/change-password',
  '/get-contact-details',
  '/update-basic-contact-details',
  '/forgot-password',
  '/get-user-data-from-token',
  '/reset-password'
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