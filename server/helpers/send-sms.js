let request = require('request');
module.exports = {
  SMSFunction(data) {
    let requestUrl = 'http://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to=' + data.mobile +
      '&msg=' + data.message + '&msg_type=TEXT&userid=' + global.config.gupShupSMS.userId +
      '&auth_scheme=plain&password=' + global.config.gupShupSMS.password + '&v=1.1&format=text';
    request(requestUrl, function(error, response, body) {
      if (error) {
        console.log(error);
      } else {
        console.log(response);
      }
    });
  }
}
