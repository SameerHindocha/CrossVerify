const Utils = require('../../libs/utils.js');
let session;
const SendMail = require("../../helpers/send-mail.js");
const randomString = require('randomstring');

module.exports = class AuthController {
  constructor(app) {
    app.get('/checkLogin', this.IsLoogedIn);
    app.post('/login', this.Login);
    app.get('/logout', this.Logout);
    app.put('/change-password', this.changePassword);
    app.post('/forgot-password', this.forgotPassword);
    app.get('/get-user-data-from-token/:ResetToken', this.getUserDataFromToken);
    app.put('/reset-password', this.resetPasssword);


  }

  IsLoogedIn(req, res) {
    session = req.session;
    if (req.session.isLoggedIn == 'Y') {
      res.send(req.session.userProfile);
    } else {
      res.status(401).send({ message: 'User is not Logged in' });
    }
  }

  Login(req, res) {
    let Email, Password, sessionObj;
    Email = req.body.Email;
    Password = Utils.md5(req.body.Password);
    db.User.findOne({ email: Email, password: Password })
      .then(function(userData) {
        if (userData) {
          sessionObj = {
            _id: userData._id,
            companyName: userData.companyName,
            state: userData.state,
            city: userData.city,
            pincode: userData.pincode,
            email: userData.email,
            ownerName: userData.ownerName,
            address: userData.address,
            mobile1: userData.mobile1,
            mobile2: userData.mobile2,
            landline: userData.landline,
            panNo: userData.panNo,
            GSTNo: userData.GSTNo,
            preLink: global.preLink,
            saleFilePath: userData.saleFilePath,
            saleFile: userData.saleFile
          }

          req.session.isLoggedIn = 'Y';
          session.email = userData.email;
          req.session.userProfile = sessionObj;
          return res.status(200).send({ message: "Login successful", userData: sessionObj })
        } else {
          return res.status(404).send({ message: "Incorrect Email or Password" })
        }
      }).catch(function(error) {
        return res.status(500).send({ message: "Internal server error" })
      });
  }

  Logout(req, res) {
    req.session.destroy(function(err) {
      if (err) {
        return res.send({ message: "Error in logging out" })
      } else {
        return res.send({ message: "Logged out" })
      }
    })
  }


  changePassword(req, res) {
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    oldPassword = Utils.md5(oldPassword);
    newPassword = Utils.md5(newPassword);
    db.User.findById({ _id: req.session.userProfile._id }).then((user) => {
      if (user) {
        let storedPassword = user.password;
        if (oldPassword === storedPassword) {
          user.password = newPassword;
          db.User.update({ "_id": req.session.userProfile._id }, { $set: user }).then((response) => {
            return res.send({ user: response, message: 'Password Changed Successfully' });
          }).catch((error) => {
            return res.send(error);
          })
        } else {
          return res.send({ status: 401, message: 'Your current password does not match the entered password' })
        }
      } else {
        return res.send({ message: 'Object Not Found' });
      }
    })
  }

  forgotPassword(req, res) {
    let resetToken = randomString.generate(16);
    let tokenExpireOn = new Date().getTime();
    tokenExpireOn = tokenExpireOn + 86400000; //Expire after 24HRs
    let email = req.body.Email;
    let Username;
    let urlLink = `http://${global.config.server.url}:${global.config.server.port}/#/reset-password/` + resetToken;
    let ownerName;
    console.log("urlLink", urlLink);
    db.User.findOne({ 'email': email }).then((user) => {
      ownerName = (user.ownerName) ? user.ownerName : "user"
      let emailObj = {
        url: urlLink,
        subject: "Reset Password",
        html: `<div><h4>Hello, ${ownerName}</h4>
                           <p>You’re receiving this email due to a forgot password action you requested.
                            Click on following link to reset your password : </p>
                            <a href=${urlLink}><h2 style="border: 1px solid #175817;width: 125px;margin: 0px 100px;background: #4DC14D;color: black;font-size: 16px;padding: 25px;">Click Here</h2></a>
                            <p>This email is an automated response to your password request.</p>
                            </br>
                            <h4>Warm Regards</h4>
                            <h4>Cross Verify</h4>
                            </div>`
      };
      db.User.update({ '_id': user._id }, {
        $set: {
          'ResetToken': resetToken,
          'TokenExpire': tokenExpireOn
        }
      }).then((response) => {
        SendMail.MailFunction(emailObj, email).then((response) => {
          res.send({ message: "Email has been sent successfully to your registered Email", email: email });
        }).catch((error) => {

          res.send({ message: "Error in Sending Email" });
        })
      }).catch((error) => {
        res.send({ message: "Error in set Token" });
      })
    }).catch((error) => {
      res.status(404).send({ message: "Your email address is not registered." });
    })
  }


  getUserDataFromToken(req, res) {
    let ResetToken = req.params.ResetToken;
    db.User.findOne({ "ResetToken": ResetToken }).then((user) => {
      res.send({ user });
    }).catch(() => {
      res.send(error);
    })
  }


  resetPasssword(req, res) {
    let newPassword = Utils.md5(req.body.newPassword);
    let email = req.body.email;
    db.User.findOne({ "email": email }).then((user) => {
      user.password = newPassword;
      user.save().then((user) => {
        res.send({ message: "New Password set Successfull" });
      }).catch((err) => {
        res.send({ message: "Error in Reset Password" });
      })
    }).catch(() => {
      res.send({ message: "Object not Found" });
    })
  }
}