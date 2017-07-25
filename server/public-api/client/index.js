let Utils = require('../../libs/utils.js');
let multer = require('multer');
let session;
let storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, global.ROOT_PATH + '/../public/assets/uploads/files/')
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
    app.get('/api/gst-status/:userKey', this.getGSTStatus);
    app.get('/api/user-data/:email/:password/:GSTNo', this.fetchUserRecord);
    app.post('/api/client', multerUpload.single('file'), this.insertNewClient);

  }

  insertNewClient(req, res) {
    let Client = new db.Client();
    let userAsClient = new db.Client();
    let User = new db.User();
    let finalId;
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
    if (req.file) {
      User.file = global.ROOT_PATH + '/../public/assets/uploads/files/' + req.file.filename;
    }
    if (req.body.password) {
      User.password = Utils.md5(req.body.password)
    }
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
    if (req.file) {
      Client.file = global.ROOT_PATH + '/../public/assets/uploads/files/' + req.file.filename;
    }

    if (req.body.password) {
      Client.password = Utils.md5(req.body.password)
    }

    if (req.body.password) {
      db.User.findOne({ email: req.body.email }, function(err, repeatedUser) {
        if (repeatedUser != null) {
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
                if (linkSentBy.file) {
                  userAsClient.file = linkSentBy.file;
                }

                if (linkSentBy.password) {
                  userAsClient.password = Utils.md5(linkSentBy.password)
                }
                userAsClient.save().then((res) => {
                  res.send({ message: "Registered Successfully" })
                }).catch((error) => {
                  res.status(400).send({ message: 'Error in Registration' });
                })
              }
            })
          }).catch((error) => {
            res.status(400).send({ message: 'Error in Registration' });
          })
        } else {
          User.save().then((response) => {
            finalId = response._id
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
                  userAsClient.userId = finalId;
                  userAsClient.userKey = finalId + linkSentBy.GSTNo;
                  if (linkSentBy.file) {
                    userAsClient.file = linkSentBy.file;
                  }
                  if (linkSentBy.password) {
                    userAsClient.password = Utils.md5(linkSentBy.password)
                  }
                  userAsClient.save().then((res) => {
                    res.send({ message: "Registered Successfully" });
                  }).catch((error) => {
                    res.status(400).send({ message: 'Error in Registration' });
                  })
                }
              })
            }).catch((error) => {
              res.status(400).send({ message: 'Error in Registration' });
            })
          }).catch((error) => {
            res.status(400).send({ message: 'Error in Registration' });
          })
        }
      })
    } else {
      Client.save().then((response) => {
        res.send({ message: "Registered Successfully" })
      }).catch((err) => {
        res.status(400).send({ message: 'Error in Registration' });
      })
    }

  };


  getClientsByUser(req, res) {
    session = req.session;
    if (req.session.isLoggedIn == 'Y') {
      let email = req.params.email;
      db.User.findOne({ email: email }, function(err, foundUser) {
        if (err) {
          res.send(err)
        } else {
          db.Client.find({ userId: foundUser._id }, function(err, clients) {
            if (err) {
              res.send(err);
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
    console.log("Email" + req.params.email);
    console.log("Password" + req.params.password);
    console.log("GST NO" + req.params.GSTNo);

    db.User.findOne({ email: req.params.email, password: Utils.md5(req.params.password), GSTNo: req.params.GSTNo }, function(err, user) {
      if (err) {
        res.send(err);
      } else {
        if (user) {
          console.log("user", user);
          return res.send(user);
        } else {
          console.log("NOT FOUND");
          return res.status(404).send({ message: 'No match found' });
        }
      }
    });


  }


}