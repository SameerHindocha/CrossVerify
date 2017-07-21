let _ = require('lodash');
let XLSX = require('xlsx');
let session;
module.exports = class FileController {
  constructor(app) {
    app.get('/admin-api/compare-file/:id', this.compareFile);
  }
  compareFile(req, res) {
    session = req.session;
    if (req.session.isLoggedIn == 'Y') {

      let userFile;

      console.log("req.session.userProfile", req.session.userProfile);
      if (req.session.userProfile.file) {
        userFile = req.session.userProfile.file;
        console.log("userFile", userFile);
      }
      let user_row_object, client_row_object, clientFile;
      let status;
      db.Client.findOne({ _id: req.params.id }, function(err, matchedClient) {
        if (matchedClient.file) {
          clientFile = matchedClient.file;
          console.log("clientFile", clientFile);
          if (userFile && clientFile) {
            let userWorkBook = XLSX.readFile(userFile);
            let clientWorkBook = XLSX.readFile(clientFile);
            userWorkBook.SheetNames.forEach(function(sheetName) {
              user_row_object = XLSX.utils.sheet_to_json(userWorkBook.Sheets[sheetName]);
            });
            clientWorkBook.SheetNames.forEach(function(sheetName) {
              client_row_object = XLSX.utils.sheet_to_json(clientWorkBook.Sheets[sheetName]);
            });
            let difference = _.differenceWith(user_row_object, client_row_object, _.isEqual);
            if (difference.length == 0) {
              status = true;
            } else {
              status = false;
            }
            db.Client.findOne({ _id: req.params.id, userId: req.session.userProfile._id }, function(err, client) {
              if (err) {
                res.send(err);
              } else if (client) {
                client.fileCompareStatus = status;
              }
              client.save().then(() => {
                res.send({ difference: difference, user_row_object: user_row_object, client_row_object: client_row_object });
              }).catch((error) => {
                res.send(error);
              })
            });
          }
        } else if (err) {
          res.send(err);
        }
      })
    } else {
      res.redirect(500, '/logout');

    }

  };
}