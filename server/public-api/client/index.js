const Utils = require('../../libs/utils.js');
const multer = require('multer');
const _ = require('lodash');
const XLSX = require('xlsx');
const fs = require('file-system');
const moment = require('moment');
let session;
let storage = multer.diskStorage({
  destination: function(req, file, callback) {
    if (file.fieldname === 'purchaseFile') {
      callback(null, global.ROOT_PATH + '/../public/assets/uploads/files/purchase')
    }
    if (file.fieldname === 'salesFile') {
      callback(null, global.ROOT_PATH + '/../public/assets/uploads/files/sales')
    }
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname)
  }
});
let multerUpload = multer({ storage: storage });

module.exports = class ClientController {
  constructor(app) {
    app.get('/api/client', this.getAllClient);
    app.get('/api/client-by-user/:email', this.getClientsByUser);
    app.get('/api/client/:id', this.getClientById);
    app.get('/api/gst-status/:userKey', this.getGSTStatus);
    app.get('/api/user-data/:email/:password/:GSTNo', this.fetchUserRecord);
    app.post('/api/client', multerUpload.fields([
      { name: 'purchaseFile', maxCount: 1 },
      { name: 'salesFile', maxCount: 1 }
    ]), this.insertNewClient);
    app.put('/api/client-status/:id', this.changeMatchStatus);
    app.post('/api/purchase-file', multerUpload.fields([
      { name: 'purchaseFile', maxCount: 1 }
    ]), this.insertPurchaseFile);
  }

  insertNewClient(req, res) {
    let Client, userAsClient, User, finalId, userRowObject, clientRowObject, clientFile, userFile;
    Client = new db.Client();
    userAsClient = new db.Client();
    User = new db.User();
    Client.companyName = req.body.companyName;
    Client.address = req.body.address;
    Client.state = req.body.state;
    Client.city = req.body.city;
    Client.pincode = req.body.pincode;
    Client.email = req.body.email;
    Client.ownerName = req.body.ownerName;
    Client.mobile1 = req.body.mobile1;
    Client.mobile2 = req.body.mobile2;
    Client.landline = req.body.landline;
    Client.panNo = req.body.panNo;
    Client.GSTNo = req.body.GSTNo;
    Client.userId = req.body.userId;
    Client.userKey = req.body.userId + req.body.GSTNo;
    if (req.files.purchaseFile) {
      let purchaseFileName;
      purchaseFileName = moment().format("YYYY-MM-DD");
      clientFile = req.files.purchaseFile[0].path;
      Client.purchaseFilePath = clientFile;
      let clientWorkBook = XLSX.readFile(clientFile);
      clientRowObject = XLSX.utils.sheet_to_json(clientWorkBook.Sheets[clientWorkBook.SheetNames[0]]);
      let purchaseObject = {
        [purchaseFileName]: clientRowObject
      }
      Client.purchaseFile = purchaseObject;
    }
    User.companyName = req.body.companyName;
    User.address = req.body.address;
    User.state = req.body.state;
    User.city = req.body.city;
    User.pincode = req.body.pincode;
    User.email = req.body.email;
    User.ownerName = req.body.ownerName;
    User.mobile1 = req.body.mobile1;
    User.mobile2 = req.body.mobile2;
    User.landline = req.body.landline;
    User.panNo = req.body.panNo;
    User.GSTNo = req.body.GSTNo;
    if (req.body.password) {
      Client.password = Utils.md5(req.body.password);
      db.User.findOne({ email: req.body.email }, function(err, repeatedUser) {
        if (repeatedUser) {
          Client.save().then((resp) => {
            db.User.findOne({ _id: req.body.userId }, function(err, linkSentBy) {
              if (err) {
                res.status(500).send({ message: 'Internal Server Error' });
              } else if (linkSentBy == null) {
                res.status(404).send({ message: 'Object Not found' });
              } else {
                userAsClient.companyName = linkSentBy.companyName;
                userAsClient.address = linkSentBy.address;
                userAsClient.state = linkSentBy.state;
                userAsClient.city = linkSentBy.city;
                userAsClient.pincode = linkSentBy.pincode;
                userAsClient.email = linkSentBy.email;
                userAsClient.ownerName = linkSentBy.ownerName;
                userAsClient.mobile1 = linkSentBy.mobile1;
                userAsClient.mobile2 = linkSentBy.mobile2;
                userAsClient.landline = linkSentBy.landline;
                userAsClient.panNo = linkSentBy.panNo;
                userAsClient.GSTNo = linkSentBy.GSTNo;
                userAsClient.userId = repeatedUser._id;
                userAsClient.userKey = repeatedUser._id + linkSentBy.GSTNo;
                if (linkSentBy.password) {
                  userAsClient.password = Utils.md5(linkSentBy.password)
                }
                userAsClient.save().then((response) => {
                  res.send({ message: "Registered Successfully" })
                }).catch((error) => {
                  console.log("error--- - -- - - - - - - ", error);
                  res.status(400).send({ message: 'Error in Registration1' });
                })
              }
            })
          }).catch((error) => {
            console.log("error", error);
            res.status(400).send({ message: 'Error in Registration2' });
          })
        } else {
          //Repeated User == NULL
          //Unique Emai Id in User Table
          if (req.files.salesFile) {
            let saleFileName;
            saleFileName = moment().format("YYYY-MM-DD");
            userFile = req.files.salesFile[0].path;
            User.saleFilePath = userFile;
            let userWorkBook = XLSX.readFile(userFile);
            userRowObject = XLSX.utils.sheet_to_json(userWorkBook.Sheets[userWorkBook.SheetNames[0]]);
            let saleObject = {
              [saleFileName]: userRowObject
            }
            User.saleFile = saleObject;
          }
          if (req.body.password) {
            User.password = Utils.md5(req.body.password)
          }
          User.save().then((response) => {
            // TODO User File Unlink
            // fs.unlink(userFile, function() {});

            finalId = response._id
            Client.save().then((resp) => {
              //TODO Client File Unlink
              // fs.unlink(clientFile, function() {});

              db.User.findOne({ _id: req.body.userId }, function(err, linkSentBy) {
                if (err) {
                  res.status(500).send({ message: 'Internal Server Error' });
                } else if (linkSentBy == null) {
                  res.status(404).send({ message: 'Object Not found' });
                } else {
                  userAsClient.companyName = linkSentBy.companyName;
                  userAsClient.address = linkSentBy.address;
                  userAsClient.state = linkSentBy.state;
                  userAsClient.city = linkSentBy.city;
                  userAsClient.pincode = linkSentBy.pincode;
                  userAsClient.email = linkSentBy.email;
                  userAsClient.ownerName = linkSentBy.ownerName;
                  userAsClient.mobile1 = linkSentBy.mobile1;
                  userAsClient.mobile2 = linkSentBy.mobile2;
                  userAsClient.landline = linkSentBy.landline;
                  userAsClient.panNo = linkSentBy.panNo;
                  userAsClient.GSTNo = linkSentBy.GSTNo;
                  userAsClient.userId = finalId;
                  userAsClient.userKey = finalId + linkSentBy.GSTNo;
                  if (linkSentBy.password) {
                    userAsClient.password = Utils.md5(linkSentBy.password)
                  }
                  userAsClient.save().then((response) => {
                    res.send({ message: "Registered Successfully" });
                  }).catch((error) => {
                    console.log("error", error);
                    res.status(400).send({ message: 'Error in Registration3' });
                  })
                }
              })
            }).catch((error) => {
              res.status(400).send({ message: 'Error in Registration4' });
            })
          }).catch((error) => {
            console.log("error", error);
            res.status(400).send({ message: 'Error in Registration5' });
          })
        }
      })
    } else {
      Client.save().then((response) => {
        res.send({ message: "Registered Successfully" })
      }).catch((err) => {
        res.status(400).send({ message: 'Error in Registration6' });
      })
    }
  };

  getClientsByUser(req, res) {
    let email;
    session = req.session;
    if (req.session.isLoggedIn == 'Y') {
      email = req.params.email;
      db.User.findOne({ email: email }, function(err, foundUser) {
        if (err) {
          res.status(500).send({ message: 'Internal Server Error' });
        } else if (foundUser == null) {
          res.status(400).send({ message: 'Object Not found' });
        } else {
          db.Client.find({ userId: foundUser._id }, function(err, clients) {
            if (err) {
              res.status(500).send({ message: 'Internal Server Error' });
            } else {
              clients.link = 'http://' + global.config.server.url + ':' + global.config.server.port + '/#/client/add/' + req.session.userProfile._id;
              res.send(clients)
            }
          });
        }
      });
    } else {
      res.redirect(500, '/logout');
    }
  };

  getAllClient(req, res) {
    db.Client.find({}).then((response) => {
      res.send(response);
    }).catch((error) => {
      res.json(error);
    })
  }

  getGSTStatus(req, res) {
    db.Client.findOne({ userKey: req.params.userKey }, function(err, data) {
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

  fetchUserRecord(req, res) {
    db.User.findOne({ email: req.params.email, password: Utils.md5(req.params.password), GSTNo: req.params.GSTNo }, function(err, user) {
      if (err) {
        res.send(err);
      } else {
        if (user) {
          return res.send(user);
        } else {
          return res.status(100).send({ message: 'No match found' });
        }
      }
    });
  }

  getClientById(req, res) {
    db.Client.findOne({ _id: req.params.id }, function(err, client) {
      if (err) {
        res.send(err);
      } else {
        if (client) {
          return res.send(client);
        } else {
          return res.send({ message: 'No match found' });
        }
      }
    });
  }

  changeMatchStatus(req, res) {
    db.Client.update({ "_id": req.params.id }, { $set: { fileCompareStatus: req.body.match } }).then((response) => {}).catch((error) => {})
  }

  insertPurchaseFile(req, res) {
    let users = new db.User();
    let client = new db.Client();
    let objName = req.body.dateOfFile;
    let obj = {};
    let sessionEmail = req.session.userProfile.email;
    if (req.files.purchaseFile) {
      let clientFile = req.files.purchaseFile[0].path;
      let clientWorkBook = XLSX.readFile(clientFile);
      let clientRowObject = XLSX.utils.sheet_to_json(clientWorkBook.Sheets[clientWorkBook.SheetNames[0]]);
      obj['purchaseFile.' + objName + ''] = clientRowObject;
      db.Client.update({ "email": sessionEmail }, { $set: obj }, { multi: true })
        .then((response) => {
          fs.unlink(clientFile, function() {});
          return res.send({ message: 'Purchase File Added Successfully' });
        })
        .catch((error) => {
          return res.send({ message: 'Error in Adding Purchase File' });
        });
    }
  }

}