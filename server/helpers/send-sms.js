let request = require('request');
let _ = require('lodash');
module.exports = {
SMSFunction(data, req, res) {
        console.log("data", data);
        let requestUrl = 'http://enterprise.smsgupshup.com/GatewayAPI/rest?method=SendMessage&send_to=' + data.mobile +
            '&msg=' + data.message + '&msg_type=text&userid=' + global.config.gupShupSMS.userId +
            '&auth_scheme=plain&password=' + global.config.gupShupSMS.password + '&v=1.1&format=text';
        request(requestUrl, function(error, response, body) {
            if (error) {
                res.status(400).send({ message: 'Internal error in sending SMS' })
            } else {
                let split = body.split('|');
                let splittedResponse = _.trim(split[0]);
                if (splittedResponse === "success") {
                    res.status(200).send({ message: 'SMS sent successfully' })
                } else if (splittedResponse === "error") {
                    res.status(400).send({ message: 'Error in sending SMS' })
                }
            }
        });
    }
}
