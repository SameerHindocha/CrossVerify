const _ = require('lodash');
const XLSX = require('xlsx');
let session;
module.exports = class FileController {
  constructor(app) {
    app.get('/admin-api/compare-file/:id', this.compareFile);
  }
  compareFile(req, res) {
    let userFile, userRowObject, clientRowObject, clientFile, status,userWorkBook, clientWorkBook, difference;
    session = req.session;
    if (req.session.isLoggedIn == 'Y') {
      if (req.session.userProfile.file) {
        userFile = req.session.userProfile.file;
      }
      db.Client.findOne({ _id: req.params.id }, function(err, matchedClient) {
        if (matchedClient.file) {
          clientFile = matchedClient.file;
          if (userFile && clientFile) {
             userWorkBook = XLSX.readFile(userFile);
             clientWorkBook = XLSX.readFile(clientFile);
            userWorkBook.SheetNames.forEach(function(sheetName) {
              userRowObject = XLSX.utils.sheet_to_json(userWorkBook.Sheets[sheetName]);
            });
            clientWorkBook.SheetNames.forEach(function(sheetName) {
              clientRowObject = XLSX.utils.sheet_to_json(clientWorkBook.Sheets[sheetName]);
            });
             difference = _.differenceWith(userRowObject, clientRowObject, _.isEqual);
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
                res.send({ difference: difference, userRowObject: userRowObject, clientRowObject: clientRowObject });
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