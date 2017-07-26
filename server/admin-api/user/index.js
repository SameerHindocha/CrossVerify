const Utils = require('../../libs/utils.js');
const multer = require('multer');
const fs = require('file-system');
let session, storage, multerUpload;
storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, global.ROOT_PATH + '/../public/assets/uploads/files/')
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname)
  }
});
multerUpload = multer({ storage: storage });

module.exports = class UserController {
  constructor(app) {
    app.get('/admin-api/user/:id', this.getUserbyId);
    app.get('/admin-api/gst-status/:gstNo', this.getGSTStatus);
    app.post('/admin-api/user', multerUpload.single('file'), this.insertNewUser);
    app.post('/admin-api/edit-user', multerUpload.single('file'), this.updateUser);
  }

  insertNewUser(req, res) {
    let postbody = req.body;
    let users = new db.User();
    users.companyName = postbody.companyName;
    users.address = postbody.address;
    users.state = postbody.state;
    users.city = postbody.city;
    users.pincode = postbody.pincode;
    users.email = postbody.email;
    users.password = Utils.md5(postbody.password);
    users.ownerName = postbody.ownerName;
    users.mobile1 = postbody.mobile1;
    users.mobile2 = postbody.mobile2;
    users.landline = postbody.landline;
    users.panNo = postbody.panNo;
    users.GSTNo = postbody.GSTNo;
    if (req.file) {
      users.file = global.ROOT_PATH + '/../public/assets/uploads/files/' + req.file.filename;
    }
    db.User.findOne({ email: postbody.email }).then((response) => {
      if (response != null) {
        return res.status(409).send({ message: "Email is already registered" });
      } else {
        users.save(function(err) {
          if (err) {
            res.send(err);
          } else {
            res.json({ message: 'User Added Successfully' });
          }
        });
      }
    }).catch((error) => {
      res.json(error);
    });
  };

  getUserbyId(req, res) {
    session = req.session;
    if (req.session.isLoggedIn == 'Y') {
      db.User.findById({ _id: req.params.id }, function(err, data) {
        if (err) {
          res.send(err);
        } else {
          res.json(data);
        }
      });
    } else {
      res.redirect(500, '/logout');
    }
  };

  updateUser(req, res) {
    let filePath, fileToDelete, sessionEmail, updatebody;
    session = req.session;
    if (req.session.isLoggedIn == 'Y') {
      sessionEmail = req.session.userProfile.email;
      updatebody = req.body;
      db.User.findOne({ "email": sessionEmail })
        .then((user) => {
          if (user != null) {
            user.address = updatebody.address;
            user.state = updatebody.state;
            user.city = updatebody.city;
            user.pincode = updatebody.pincode;
            user.ownerName = updatebody.ownerName;
            user.mobile1 = updatebody.mobile1;
            user.mobile2 = updatebody.mobile2;
            user.landline = updatebody.landline;
            if (user.file) {
              fileToDelete = user.file;
            }
            if (req.file) {
              user.file = global.ROOT_PATH + '/../public/assets/uploads/files/' + req.file.filename;
            }
          }
          user.save()
            .then((user) => {
              req.session.userProfile = user;
              if (req.file) {
                filePath = global.ROOT_PATH + '/../public/assets/uploads/files/' + req.file.filename
              }
              db.Client.update({ "email": sessionEmail }, {
                  $set: {
                    "address": updatebody.address,
                    "state": updatebody.state,
                    "city": updatebody.city,
                    "pincode": updatebody.pincode,
                    "ownerName": updatebody.ownerName,
                    "mobile1": updatebody.mobile1,
                    "mobile2": updatebody.mobile2,
                    "landline": updatebody.landline,
                    "file": filePath
                  }
                }, { multi: true })
                .then((response) => {
                  if (user.file) {
                    fs.unlink(fileToDelete, function() {});
                  }
                  res.status(200).send({ message: "Updated successfully", user: user });
                }).catch((error) => {
                  res.status(404).send({ message: 'Object Not Found' });
                })
            }).catch((error) => {
              res.status(400).send({ message: "Error in updating user" })
            })
        }).catch((error) => {
          res.status(404).send({ message: 'Object Not Found' });
        })
    } else {
      res.redirect(500, '/logout');
    }
  };

  getGSTStatus(req, res) {
    db.User.findOne({ GSTNo: req.params.gstNo }, function(err, data) {
      if (err) {
        res.send(err);
      } else {
        if (data) {
          return res.status(409).send({ message: "GST is already registered" });
        } else {
          return res.send({ message: 'No match found' });
        }
      }
    });
  };
}