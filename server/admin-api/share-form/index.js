let SendMail = require("../../helpers/send-mail.js");
let SendSMS = require("../../helpers/send-sms.js");
let request = require('request');
let session;

module.exports = class ShareFormController {
  constructor(app) {
    app.get('/admin-api/share-form/:email', this.sendMail);
    app.get('/admin-api/send-sms/:email', this.sendSMS);
    // app.get('/admin-api/share-link/:email', this.shareLink);
  }

  sendMail(req, res) {
    session = req.session;
    if (req.session.isLoggedIn == 'Y') {
      let emailObj = {
        subject: `Welcome to GST registration ${req.session.userProfile.ownerName}`, // Subject line
        html: `<h4>We ${req.session.userProfile.companyName}  request you to fill your Company DETAILS with GSTIN ,WHICH WILL BE NEEDED ( WITHOUT SPELLING ERROR).
      </h4>We humbly request to fill up this form and submit it as early as possible to update your details with our company.
                    <h4> PLEASE CLICK ON THE FOLLOWING LINK TO UPDATE YOUR DETAILS.</h4><br>
                    <a href='http://${global.config.server.url}:${global.config.server.port}/#/client/add/${req.session.userProfile._id}' class='alert-link'>Click here to fill the Cross Verify registration form</a></br></br>
                    <br /><br />
                    <h4>
                    What is CrossVerify.in <br />
CrossVerify is a free portal where you can register your company ,unique link will be created of your company you can send it through whatsapp ,email or any other messaging service to your clients
  Your client can fill all their company details with GSTIN and submit ,if they want same service you are using then they just need to provide password while submitting form and they will automaticially be registered and can get details of thier client also
  If you are already registered with CrossVerify.in, and your client asks for your company details you just need to login on the link sent by your client ,all your detials will be auto submitted to your client and their details will be auto fetched to your company database
                    </h4>

                   <h4>Warm Regards,<h4>
                    <h4>GST team</h4>`,
      };
      SendMail.MailFunction(emailObj, req.session.userProfile.email).then(function(data) {
        res.send({ message: "Email has been sent successfully to your registered mail" })
      }, function(err) {
        res.send(err)
      });
    } else {
      res.redirect(500, '/logout');
    }
  };

  sendSMS(req, res) {
    session = req.session;
    if (req.session.isLoggedIn == 'Y') {
      let uri = `http://${global.config.server.url}:${global.config.server.port}/#/client/add/${req.session.userProfile._id}`
      let link = encodeURIComponent(uri);
      let msg = `We  ${req.session.userProfile.companyName} request you to fill your Company DETAILS with GSTIN ,WHICH WILL BE NEEDED ( WITHOUT SPELLING ERROR) . WE HUMBALLY REQUEST TO FILL UP THIS FORM AND SUBMIT IT AS EARLY AS POSSIBLE TO UPDATE YOUR DETAILS WITH OUR Company.

PLEASE CLICK ON THE FOLLOWING LINK TO UPDATE YOUR DETAILS : `
      msg += link;

      let data = {
        mobile: req.session.userProfile.mobile1,
        message: msg
      }
      console.log(msg);
      SendSMS.SMSFunction(data, req, res);
    } else {
      res.redirect(500, '/logout');
    }
  }
}