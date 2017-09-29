const SendMail = require("../../helpers/send-mail.js");
const SendSMS = require("../../helpers/send-sms.js");
const request = require('request');
const TinyURL = require('tinyurl');
let session;

module.exports = class ShareFormController {
  constructor(app) {
    app.get('/admin-api/send-mail/:email', this.sendMail);
    app.get('/admin-api/send-sms/:email', this.sendSMS);
    app.post('/admin-api/send-confirmation-mail', this.sendConfirmationMail);
    app.post('/admin-api/send-confirmation-sms', this.sendConfirmationSMS);
    app.post('/admin-api/send-otp-sms', this.sendOTPSMS);
    app.post('/admin-api/send-otp-email', this.sendOTPEmail);
    app.post('/admin-api/send-monthly-mail', this.sendMonthlyMail);
    app.post('/admin-api/send-monthly-sms', this.sendMonthlySMS);
    app.post('/admin-api/send-all-monthly-mail', this.sendAllMonthlyMail)
    app.post('/admin-api/send-all-monthly-sms', this.sendAllMonthlySMS);

  }

  sendMail(req, res) {
    let emailObj;
    session = req.session;
    if (req.session.isLoggedIn == 'Y') {
      emailObj = {
        subject: `Welcome to Cross Verify registration`, // Subject line
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

                   <h4>Warm Regards,</h4>
                   <h4>${req.session.userProfile.companyName} </h4>`,
      };
      SendMail.MailFunction(emailObj, req.session.userProfile.email).then(function(data) {
        res.send({ message: "Link has been sent successfully to your registered Email" })
      }, function(err) {
        res.send(err)
      });
    } else {
      res.redirect(500, '/logout');
    }
  };

  sendSMS(req, res) {
    let uri, link, msg, data;
    session = req.session;
    if (req.session.isLoggedIn == 'Y') {
      uri = `http://${global.config.server.url}:${global.config.server.port}/#/client/add/${req.session.userProfile._id}`
      link = encodeURIComponent(uri);
      msg = `We  ${req.session.userProfile.companyName} request you to fill your Company DETAILS with GSTIN ,WHICH WILL BE NEEDED ( WITHOUT SPELLING ERROR) . WE HUMBALLY REQUEST TO FILL UP THIS FORM AND SUBMIT IT AS EARLY AS POSSIBLE TO UPDATE YOUR DETAILS WITH OUR Company.

PLEASE CLICK ON THE FOLLOWING LINK TO UPDATE YOUR DETAILS : `
      msg += link;
      data = {
        mobile: req.session.userProfile.mobile1,
        message: msg
      }
      SendSMS.SMSFunction(data, req, res);
    } else {
      res.redirect(500, '/logout');
    }
  }

  sendConfirmationMail(req, res) {
    console.log("req.body.data", req.body.data);
    let emailObj;
    let email = req.body.data.Email_Address;
    let stringifiedData = JSON.stringify(req.body.data);
    session = req.session;
    if (req.session.isLoggedIn == 'Y') {
      if (req.body.data.type == 'Sale') {
        emailObj = {
          subject: `This is a Confirmation Email`, // Subject line
          html: `<h4>This is a confirmation mail sent by ${req.session.userProfile.companyName}</h4>
         The updated data is as follows. You can either accept the changes by clicking on Correct button or decline the
         changes by clicking on the Wrong button.</h4>
         <table style="border-left:1px solid #ddd; border-top:1px solid #ddd; border-spacing: 0; border-collapse: collapse;">
         <tr>
         <td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">Email_Address</td><td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">${req.body.data.Email_Address}</td>
         </tr>
          <tr>
         <td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">Mobile_Number</td><td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">${req.body.data.Mobile_Number}</td>
         </tr>
          <tr>
         <td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">Customer_Billing_Name</td><td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">${req.body.data.Customer_Billing_Name}</td>
         </tr>
           <tr>
         <td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">Customer_Billing_Address</td><td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">${req.body.data.Customer_Billing_Address}</td>
         </tr>
           <tr>
         <td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">Customer_Billing_City</td><td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">${req.body.data.Customer_Billing_City}</td>
         </tr>
           <tr>
         <td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">Customer_Billing_PinCode</td><td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">${req.body.data.Customer_Billing_PinCode}</td>
         </tr>
         <tr>
         <td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">Customer_Billing_GSTIN</td><td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">${req.body.data.Customer_Billing_GSTIN}</td>
         </tr>
         <tr>
         <td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">Invoice_Number</td><td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">${req.body.data.Invoice_Number}</td>
         </tr>
         <tr>
         <td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">CGST_Amount</td><td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">${req.body.data.CGST_Amount}</td>
         </tr>
         <tr>
         <td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">SGST_Amount</td><td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">${req.body.data.SGST_Amount}</td>
         </tr>
         <tr>
         <td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">TCS</td><td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">${req.body.data.TCS}</td>
         </tr>
         <tr>
         <td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">Cess_Amount</td><td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">${req.body.data.Cess_Amount}</td>
         </tr>
          <tr>
         <td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">Roundoff</td><td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">${req.body.data.Roundoff}</td>
         </tr>
          <tr>
         <td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">Item_Total_Including_GST</td><td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">${req.body.data.Item_Total_Including_GST}</td>
         </tr>
          <tr>
         <td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">Taxable_Value_on_which_TCS_has_been_deducted</td><td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">${req.body.data.Taxable_Value_on_which_TCS_has_been_deducted}</td>
         </tr>
          <tr>
         <td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">Exempted_Amount</td><td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">${req.body.data.Exempted_Amount}</td>
         </tr>
          <tr>
         <td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">Non_GST_Amount</td><td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">${req.body.data.Non_GST_Amount}</td>
         </tr>
          <tr>
         <td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">Item_Discount</td><td style="padding:5px; border-right:1px solid #ddd; border-bottom:1px solid #ddd;">${req.body.data.Item_Discount}</td>
         </tr>
         </table>
          <br><br>
          <a href="http://${global.config.server.url}:${global.config.server.port}/admin-api/change-sale-status-by-mail/${req.body.data.date}/verified/${req.session.userProfile._id}/${req.body.data._id}" style="font-size:16px; background-color:#5cb85c;color:white; font-weight: bold; font-family: Helvetica, Arial, sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block;padding:8px 15px">Correct</a>
          <a href="http://${global.config.server.url}:${global.config.server.port}/admin-api/change-sale-status-by-mail/${req.body.data.date}/mismatched/${req.session.userProfile._id}/${req.body.data._id}" style="font-size:16px; background-color:#E51400;color:white; font-weight: bold; font-family: Helvetica, Arial, sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block;padding:8px 15px">Wrong</a>
         `
        }
      } else if (req.body.data.type == 'Purchase') {
        emailObj = {
          subject: `This is a Confirmation Email`, // Subject line
          html: `<h4>This is a confirmation mail sent by ${req.session.userProfile.companyName}</h4>
         The updated data is as follows. You can either accept the changes by clicking on Correct button or decline the
         changes by clicking on the Wrong button.</h4>
         <table border="2">
         <tr>
         <td>Email_Address</td><td>${req.body.data.Email_Address}</td>
         </tr>
         <tr>
         <td>Invoice_Number</td><td>${req.body.data.Invoice_Number}</td>
         </tr>
           <tr>
         <td>Invoice_Date</td><td>${req.body.data.Invoice_Date}</td>
         </tr>
           <tr>
         <td>Invoice_Number</td><td>${req.body.data.Invoice_Number}</td>
         </tr>
           <tr>
         <td>Invoice_Category</td><td>${req.body.data.Invoice_Category}</td>
         </tr>
           <tr>
         <td>Invoice_Number</td><td>${req.body.data.Invoice_Number}</td>
         </tr>
           <tr>
         <td>Supply_Type</td><td>${req.body.data.Supply_Type}</td>
         </tr>
           <tr>
         <td>Supplier_Name</td><td>${req.body.data.Supplier_Name}</td>
         </tr>
           <tr>
         <td>Supplier_Address</td><td>${req.body.data.Supplier_Address}</td>
         </tr>
           <tr>
         <td>Supplier_City</td><td>${req.body.data.Supplier_City}</td>
         </tr>
           <tr>
         <td>Supplier_PinCode</td><td>${req.body.data.Supplier_PinCode}</td>
         </tr>
           <tr>
         <td>Supplier_State</td><td>${req.body.data.Supplier_State}</td>
         </tr>
           <tr>
         <td>Supplier_GSTIN</td><td>${req.body.data.Supplier_GSTIN}</td>
         </tr>
           <tr>
         <td>Item_Category</td><td>${req.body.data.Item_Category}</td>
         </tr>
           <tr>
         <td>Item_Total_Before_Discount</td><td>${req.body.data.Item_Total_Before_Discount}</td>
         </tr>
           <tr>
         <td>Item_Discount</td><td>${req.body.data.Item_Discount}</td>
         </tr>
           <tr>
         <td>Item_Taxable_Value</td><td>${req.body.data.Item_Taxable_Value}</td>
         </tr>
           <tr>
         <td>CGST_Amount</td><td>${req.body.data.CGST_Amount}</td>
         </tr>
           <tr>
         <td>SGST_Amount</td><td>${req.body.data.SGST_Amount}</td>
         </tr>
           <tr>
         <td>IGST_Amount</td><td>${req.body.data.IGST_Amount}</td>
         </tr>
           <tr>
         <td>CESS_Amount</td><td>${req.body.data.CESS_Amount}</td>
         </tr>
           <tr>
         <td>TCS</td><td>${req.body.data.TCS}</td>
         </tr>
           <tr>
         <td>Item_Total_Including_GST</td><td>${req.body.data.Item_Total_Including_GST}</td>
         </tr>
         </table>
          <br><br>
          <a href="http://${global.config.server.url}:${global.config.server.port}/admin-api/change-purchase-status-by-mail/${req.body.data.date}/verified/${req.session.userProfile._id}/${req.body.data._id}" style="font-size:16px; background-color:#5cb85c;color:white; font-weight: bold; font-family: Helvetica, Arial, sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block;padding:8px 15px">Correct</a>
          <a href="http://${global.config.server.url}:${global.config.server.port}/admin-api/change-purchase-status-by-mail/${req.body.data.date}/mismatched/${req.session.userProfile._id}/${req.body.data._id}" style="font-size:16px; background-color:#E51400;color:white; font-weight: bold; font-family: Helvetica, Arial, sans-serif; text-decoration: none; line-height:40px; width:100%; display:inline-block;padding:8px 15px">Wrong</a>
         `
        }
      };

      console.log("email", email);
      console.log("emailObj", emailObj);
      SendMail.MailFunction(emailObj, email).then(function(data) {
        res.send({ message: "Confirmation Email has been sent successfully to your registered Email" })
      }, function(err) {
        res.send(err)
      });
    } else {
      res.redirect(500, '/logout');
    }
  }

  sendConfirmationSMS(req, res) {

    let uri, link, msg, data;
    session = req.session;
    if (req.session.isLoggedIn == 'Y') {
      uri = `http://${global.config.server.url}:${global.config.server.port}/#/client/add/${req.session.userProfile._id}`
      link = encodeURIComponent(uri);
      msg = `We  ${req.session.userProfile.companyName} request you to fill your Company DETAILS with GSTIN ,WHICH WILL BE NEEDED ( WITHOUT SPELLING ERROR) . WE HUMBALLY REQUEST TO FILL UP THIS FORM AND SUBMIT IT AS EARLY AS POSSIBLE TO UPDATE YOUR DETAILS WITH OUR Company.

PLEASE CLICK ON THE FOLLOWING LINK TO UPDATE YOUR DETAILS : `
      msg += link;
      data = {
        mobile: req.params.mobile,
        message: msg
      }
      SendSMS.SMSFunction(data, req, res);
    } else {
      res.redirect(500, '/logout');
    }


  }

  sendOTPSMS(req, res) {

    let uri, link, msg, data;
    session = req.session;
    msg = `Your OTP is :  ` + req.body.otp
    console.log("msg", msg);
    data = {
      mobile: req.body.mobile,
      message: msg
    }
    SendSMS.SMSFunction(data, req, res);

  }

  sendOTPEmail(req, res) {
    let emailObj;
    let email = req.body.email;
    session = req.session;
    emailObj = {
      subject: `This is a Monthly Email`, // Subject line
      html: 'Your OTP is ' + req.body.otp,
    };
    console.log("emailObj", emailObj);

    console.log("email", email);
    SendMail.MailFunction(emailObj, email).then(function(data) {
      res.send({ message: "Confirmation Email has been sent successfully to your registered Email" })
    }, function(err) {
      res.send(err)
    });

  }



  sendMonthlyMail(req, res) {
    let emailObj;
    let email = req.body.email;
    let senderName = req.body.senderName;
    let month = req.body.month;
    let type = (req.body.category == 0) ? 'Sale' : 'Purchase';
    let link = 'http://' + global.config.server.url + ':' + global.config.server.port + '/#/' + req.body.link;
    TinyURL.shorten(link, function(res) {
      link = res;
    });
    month = month.substring(5, 7);
    month = getMonthName(month);
    console.log("---------------------month---------------------", month);

    session = req.session;
    if (req.session.isLoggedIn == 'Y') {
      setTimeout(function() {
        emailObj = {
          subject: `Cross Verify monthly confirmation email`, // Subject line
          html: ` <h3>${senderName} wants you to confirm ${type} for the month ${month}. Click this link to confirm: <a href="${link}">Click here</a></h3>
          <br /> 
          <p>What is CrossVerify.in <br />
           CrossVerify is a free portal where you can register your company ,unique link will be created of your company you can send it through whatsapp ,email or any other messaging service to your clients
           Your client can fill all their company details with GSTIN and submit ,if they want same service you are using then they just need to provide password while submitting form and they will automaticially be registered and can get details of thier client also
           If you are already registered with CrossVerify.in, and your client asks for your company details you just need to login on the link sent by your client ,all your detials will be auto submitted to your client and their details will be auto fetched to your company database
           <br /></p>
           <h3>Warm Regards,</h3>
           <h3>${senderName}</h3> `
        };
        SendMail.MailFunction(emailObj, email).then(function(data) {
          res.send({ message: "Confirmation Email has been sent successfully to your registered Email" })
        }, function(err) {
          res.send(err)
        })
      }, 5000)
    } else {
      res.redirect(500, '/logout');

    }
  }

  sendMonthlySMS(req, res) {
    console.log('sendMonthlySMS body', req.body);
    let uri, link, msg, data;
    let senderName = req.body.senderName;
    let month = req.body.month;
    console.log("month : ", month);
    let type = (req.body.category == 0) ? 'Sale' : 'Purchase';
    session = req.session;
    month = month.substring(5, 7);
    month = getMonthName(month);
    console.log("---------------------month---------------------", month);

    uri = 'http://' + global.config.server.url + ':' + global.config.server.port + '/#/' + req.body.link;
    TinyURL.shorten(uri, function(res) {
      link = res;
    });
    setTimeout(function() {
      msg = `${senderName} wants you to confirm ${type} for the month ${month}. Click this link to confirm: ` + link;
      msg = encodeURIComponent(msg);

      data = {
        mobile: req.body.mobile,
        message: msg
      }

      console.log("data - - ", data);
      SendSMS.SMSFunction(data, req, res);
    }, 5000)
  }

  sendAllMonthlyMail(req, res) {
    month = month.substring(5, 7);
    month = getMonthName(month);

  }

  sendAllMonthlySMS(req, res) {
    month = month.substring(5, 7);
    month = getMonthName(month);
  }



}

function getMonthName(month) {
  switch (month) {
    case '01':
      month = "January";
      break;
    case '02':
      month = "February";
      break;
    case '03':
      month = "March";
      break;
    case '04':
      month = "April";
      break;
    case '05':
      month = "May";
      break;
    case '06':
      month = "June";
      break;
    case '07':
      month = "July";
      break;
    case '08':
      month = "August";
      break;
    case '09':
      month = "September";
      break;
    case '10':
      month = "October";
      break;
    case '11':
      month = "November";
      break;
    case '12':
      month = "December";
      break;
  }
  return month;

}