module.exports = {
  MailFunction(emailObject, Email) {
    let sendMail, deferred, smtpConfiguration, gstEmailTransporter, emailOb;
    const q = require("q");
    const nodemailer = require('nodemailer');
    sendMail = (mailOptions, email) => {
      mailOptions.from = mailOptions.from || global.config.mailServer.fromAddress;
      mailOptions.to = email;
      deferred = q.defer();
      smtpConfiguration = {
        host: global.config.mailServer.host,
        port: global.config.mailServer.port,
        secure: global.config.mailServer.secure,
        debug: global.config.mailServer.debug,
        auth: {
          user: global.config.mailServer.username,
          pass: global.config.mailServer.password
        }
      };
      gstEmailTransporter = nodemailer.createTransport(smtpConfiguration);
      gstEmailTransporter.sendMail(mailOptions, function(mailError, mailResponseStatus) {
        if (mailError) {
          deferred.reject(mailError);
        } else {
          deferred.resolve(true);
        }
      });
      return deferred.promise;
    };
    emailOb = emailObject;
    return sendMail(emailOb, Email);
  }
}