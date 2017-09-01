const Utils = require('../../libs/utils.js');
let session;
module.exports = class AuthController {
  constructor(app) {
    app.get('/checkLogin', this.IsLoogedIn);
    app.post('/login', this.Login);
    app.get('/logout', this.Logout);
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
}