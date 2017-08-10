const Utils = require('../../libs/utils.js');
const multer = require('multer');
const fs = require('file-system');
const _ = require('lodash');
const XLSX = require('xlsx');
let session, storage, multerUpload;

storage = multer.diskStorage({
  destination: function(req, file, callback) {
    if (file.fieldname === 'purchaseFile') {
      callback(null, global.ROOT_PATH + '/../public/assets/uploads/files/purchase/')
    }
    if (file.fieldname === 'saleFile') {
      callback(null, global.ROOT_PATH + '/../public/assets/uploads/files/sales/')
    }
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
    app.post('/admin-api/user', multerUpload.fields([
      { name: 'saleFile', maxCount: 1 }
    ]), this.insertNewUser);
    app.post('/admin-api/edit-user', multerUpload.fields('file'), this.updateUser);
    app.post('/admin-api/file', multerUpload.fields([
      { name: 'purchaseFile', maxCount: 1 },
      { name: 'saleFile', maxCount: 1 }
    ]), this.insertFile);
  }

  insertNewUser(req, res) {
    let objName = "2025"
    let userRowObject;
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
    if (req.files.saleFile) {
      let userFile, userWorkBook;
      userFile = req.files.saleFile[0].path;
      users.saleFilePath = userFile;
      userWorkBook = XLSX.readFile(userFile);
      userRowObject = XLSX.utils.sheet_to_json(userWorkBook.Sheets[userWorkBook.SheetNames[0]]);
      // let saleObject = {}
      let saleObject = {
        [objName]: userRowObject
      }

      // _.create(users.saleFile, { objName: userRowObject })
      // console.log("saleObject", saleObject);
      users.saleFile = saleObject

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
      console.log("error", error);
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
    let filePath, sessionEmail, updatebody, userRowObject, userFile;
    session = req.session;
    if (session.isLoggedIn == 'Y') {
      console.log("YES");
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
            // if (user.saleFilePath) {
            //   fileToDelete = user.saleFilePath;
            // }
            if (req.file) {
              userFile = req.file.path
              user.saleFilePath = userFile;
              let userWorkBook = XLSX.readFile(userFile);
              userRowObject = XLSX.utils.sheet_to_json(userWorkBook.Sheets[userWorkBook.SheetNames[0]]);
              let newSaleObj = {
                "samir": userRowObject
              }
              user.saleFile = newSaleObj;
            }
          }
          user.save()
            .then((user) => {
              req.session.userProfile = user;
              db.Client.update({ "email": sessionEmail }, {
                  $set: {
                    "address": updatebody.address,
                    "state": updatebody.state,
                    "city": updatebody.city,
                    "pincode": updatebody.pincode,
                    "ownerName": updatebody.ownerName,
                    "mobile1": updatebody.mobile1,
                    "mobile2": updatebody.mobile2,
                    "landline": updatebody.landline
                  }
                }, { multi: true })
                .then((response) => {
                  if (req.file) {
                    // fs.unlink(fileToDelete, function() {});
                    db.Client.update({ 'userId': req.session.userProfile._id }, {
                        $set: {
                          "fileCompareStatus": null
                        }
                      }, { multi: true })
                      .then((response) => {
                        res.status(200).send({ message: "Updated successfully", user: user });
                      }).catch((error) => {
                        res.status(404).send({ message: 'Object Not Found' });
                      })
                  } else {
                    res.status(200).send({ message: "Updated successfully", user: user });
                  }
                }).catch((error) => {
                  res.status(404).send({ message: 'Object Not Found' });
                })
            }).catch((error) => {
              res.status(400).send({ message: "Error in updating user" })
            })
        }).catch((error) => {
          console.log("error", error);
          res.status(404).send({ message: 'Object Not Found' });
        })
    } else {
      res.redirect(500, '/logout');
    }
  };

  getGSTStatus(req, res) {
    db.User.findOne({ GSTNo: req.params.gstNo }, function(err, data) {
      if (err) {
        return res.send(err);
      } else {
        if (data) {
          return res.status(409).send({ message: "GST is already registered" });
        } else {
          return res.send({ message: 'No match found' });
        }
      }
    });
  };

  insertFile(req, res) {
    // ISSUE Can't sent multiple response
    // SOLUTION Create Seprete api
    let users = new db.User();
    let client = new db.Client();
    let objName = req.body.dateOfFile;
    let obj;
    let sessionEmail = req.session.userProfile.email;

    if (req.files.saleFile) {
      let userFile, userWorkBook, userRowObject;
      userFile = req.files.saleFile[0].path;
      userWorkBook = XLSX.readFile(userFile);
      userRowObject = XLSX.utils.sheet_to_json(userWorkBook.Sheets[userWorkBook.SheetNames[0]]);
      obj = {};
      obj['saleFile.' + objName + ''] = userRowObject;
      db.User.update({ "_id": req.body.id }, { $set: obj })
        .then((response) => {
          fs.unlink(userFile, function() {});
          // return res.send({ message: 'File Added Successfully' });
        })
        .catch((error) => {
          // return res.send({ message: 'Error in Adding File' });
        });
    }
    if (req.files.purchaseFile) {
      let clientFile = req.files.purchaseFile[0].path;
      let clientWorkBook = XLSX.readFile(clientFile);
      let clientRowObject = XLSX.utils.sheet_to_json(clientWorkBook.Sheets[clientWorkBook.SheetNames[0]]);
      obj = {};
      obj['purchaseFile.' + objName + ''] = clientRowObject;
      db.Client.update({ "email": sessionEmail }, { $set: obj }, { multi: true })
        .then((response) => {
          fs.unlink(clientFile, function() {});
          return res.send({ message: 'File Added Successfully' });
        })
        .catch((error) => {
          return res.send({ message: 'Error in Adding File' });
        });
    }
  }

}