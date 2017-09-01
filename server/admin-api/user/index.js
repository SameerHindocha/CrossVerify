const Utils = require('../../libs/utils.js');
const multer = require('multer');
const fs = require('file-system');
const _ = require('lodash');
const XLSX = require('xlsx');
const moment = require('moment');
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
    app.post('/admin-api/user', this.insertNewUser);
    app.put('/admin-api/edit-user', this.updateUser);
    // app.post('/admin-api/sale-file', multerUpload.fields([
    //   { name: 'saleFile', maxCount: 1 },
    //   { name: 'purchaseFile', maxCount: 1 }
    // ]), this.insertSaleFile);
    app.get('/admin-api/filter-invoices-by-month/:month', this.filterInvoicesByMonth);
    app.put('/admin-api/update-contact-detail', this.updateContactDetail);
    app.put('/admin-api/update-sale-file', this.updateSaleFile);
    app.put('/admin-api/update-purchase-file', this.updatePurchaseFile);
    app.put('/admin-api/change-status', this.changeStatus);
    app.put('/admin-api/update-client-info', this.updateClient);
    app.put('/admin-api/post-file-data', this.insertFileData);
    app.post('/admin-api/read-file-data', multerUpload.fields([
      { name: 'saleFile', maxCount: 1 },
      { name: 'purchaseFile', maxCount: 1 }
    ]), this.readFileData);


  }

  // insertNewUser(req, res) {
  //   let userRowObject;
  //   let postbody = req.body;
  //   let users = new db.User();
  //   let userFile;
  //   users.companyName = postbody.companyName;
  //   users.address = postbody.address;
  //   users.state = postbody.state;
  //   users.city = postbody.city;
  //   users.pincode = postbody.pincode;
  //   users.email = postbody.email;
  //   users.password = Utils.md5(postbody.password);
  //   users.ownerName = postbody.ownerName;
  //   users.mobile1 = postbody.mobile1;
  //   users.mobile2 = postbody.mobile2;
  //   users.landline = postbody.landline;
  //   users.panNo = postbody.panNo;
  //   users.GSTNo = postbody.GSTNo;
  //   if (req.files.saleFile) {
  //     let objName;
  //     objName = moment().format("YYYY-MM-DD");
  //     let userWorkBook;
  //     userFile = req.files.saleFile[0].path;
  //     users.saleFilePath = userFile;
  //     userWorkBook = XLSX.readFile(userFile);
  //     userRowObject = XLSX.utils.sheet_to_json(userWorkBook.Sheets[userWorkBook.SheetNames[0]]);
  //     let saleObject = {
  //       [objName]: userRowObject
  //     }
  //     users.saleFile = saleObject
  //   }
  //   db.User.findOne({ email: postbody.email }).then((response) => {
  //     if (response != null) {
  //       return res.status(409).send({ message: "Email is already registered" });
  //     } else {
  //       users.save(function(err) {
  //         if (err) {
  //           res.send(err);
  //         } else {
  //           if (userFile) {
  //             fs.unlink(userFile, function() {});
  //           }
  //           res.json({ message: 'User Registered Successfully' });
  //         }
  //       });
  //     }
  //   }).catch((error) => {
  //     console.log("error", error);
  //     res.json(error);
  //   });
  // }
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
    db.User.findOne({ email: postbody.email }).then((response) => {
      if (response != null) {
        return res.status(409).send({ message: "Email is already registered" });
      } else {
        users.save(function(err) {
          if (err) {
            res.send(err);
          } else {
            res.json({ message: 'User Registered Successfully' });
          }
        });
      }
    }).catch((error) => {
      console.log("error", error);
      res.json(error);
    });
  }
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
  }


  updateUser(req, res) {
    let filePath, sessionEmail, updatebody, userRowObject, userFile;
    session = req.session;
    if (session.isLoggedIn == 'Y') {
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
          }
          user.save()
            .then((user) => {
              req.session.userProfile = user;
              res.status(200).send({ message: "Updated successfully", user: user });
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
  }

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
  }

  // insertSaleFile(req, res) {
  //   let users = new db.User();
  //   let client = new db.Client();
  //   let objName = req.body.dateOfFile;
  //   let obj;
  //   let sessionEmail = req.session.userProfile.email;
  //   if (req.files.saleFile && req.files.purchaseFile) {
  //     let userFile, userWorkBook, userRowObject;
  //     userFile = req.files.saleFile[0].path;
  //     userWorkBook = XLSX.readFile(userFile);
  //     userRowObject = XLSX.utils.sheet_to_json(userWorkBook.Sheets[userWorkBook.SheetNames[0]]);
  //     obj = {};
  //     obj['saleFile.' + objName + ''] = userRowObject;
  //     db.User.update({ "_id": req.session.userProfile._id }, { $set: obj })
  //       .then((response) => {
  //         fs.unlink(userFile, function() {});
  //         // return res.send({ message: 'Sale File Added Successfully', data: userRowObject });
  //         if (req.files.purchaseFile) {
  //           obj = {};
  //           let clientFile = req.files.purchaseFile[0].path;
  //           let clientWorkBook = XLSX.readFile(clientFile);
  //           let clientRowObject = XLSX.utils.sheet_to_json(clientWorkBook.Sheets[clientWorkBook.SheetNames[0]]);
  //           obj['purchaseFile.' + objName + ''] = clientRowObject;
  //           db.User.update({ "email": sessionEmail }, { $set: obj }, { multi: true })
  //             .then((response) => {
  //               fs.unlink(clientFile, function() {});
  //               return res.send({ message: 'Purchase File and Sale File Added Successfully', saleFileObject: userRowObject, purchaseFileObject: clientRowObject });
  //             })
  //             .catch((error) => {
  //               return res.send({ message: 'Error in Adding Purchase File' });
  //             });
  //         }
  //       })
  //       .catch((error) => {
  //         return res.send({ message: 'Error in Adding Sale File' });
  //       });
  //   }
  // }

  readFileData(req, res) {
    if (req.files.saleFile && req.files.purchaseFile) {
      let saleFile, saleHeaderWorkBook, saleWorkBook, saleData, purchaseFile, purchaseHeaderWorkBook, purchaseWorkBook, purchaseData;
      saleFile = req.files.saleFile[0].path;
      saleHeaderWorkBook = XLSX.readFile(saleFile, { 'sheetRows': 1 });
      let salesHeaderFields = saleHeaderWorkBook.Sheets[saleHeaderWorkBook.SheetNames[0]];
      delete salesHeaderFields['!fullref'];
      delete salesHeaderFields['!margins'];
      delete salesHeaderFields['!ref'];
      saleWorkBook = XLSX.readFile(saleFile);
      saleData = XLSX.utils.sheet_to_json(saleWorkBook.Sheets[saleWorkBook.SheetNames[0]]);
      purchaseFile = req.files.purchaseFile[0].path;
      purchaseHeaderWorkBook = XLSX.readFile(purchaseFile, { 'sheetRows': 1 });
      let purchaseHeaderFields = purchaseHeaderWorkBook.Sheets[purchaseHeaderWorkBook.SheetNames[0]];
      delete purchaseHeaderFields['!fullref'];
      delete purchaseHeaderFields['!margins'];
      delete purchaseHeaderFields['!ref'];
      purchaseWorkBook = XLSX.readFile(purchaseFile);
      purchaseData = XLSX.utils.sheet_to_json(purchaseWorkBook.Sheets[purchaseWorkBook.SheetNames[0]]);
      res.send({ salesHeaderFields: salesHeaderFields, purchaseHeaderFields: purchaseHeaderFields, saleData: saleData, purchaseData: purchaseData });
    }
  }

  insertFileData(req, res) {
    let date = req.body.date;
    let saleFileData = req.body.newSaleData;
    let purchaseFileData = req.body.newPurchaseData;
    db.User.findById({ _id: req.session.userProfile._id }).then((user) => {
      console.log("user123", user);
      // user['saleFile.' + date + ''] = saleFileData;

      let obj = {};
      obj['saleFile.' + date + ''] = saleFileData;
      obj['purchaseFile.' + date + ''] = purchaseFileData;

      console.log("obj-*-- - -", obj);

      db.User.update({ "_id": req.session.userProfile._id }, { $set: obj }).then((response) => {
        // res.send({ data: response, message: 'Files uploaded Successfully' })
        res.send({ saleFileData: saleFileData, purchaseFileData: purchaseFileData, message: 'Files uploaded Successfully' })

      }).catch((error) => {
        res.send(error);
      })
    })
  }

  filterInvoicesByMonth(req, res) {
    let filteredSaleFileData = [];
    let filteredPurchaseFileData = [];
    let saleKeys = [];
    let purchaseKeys = [];
    let filterMonth = req.params.month;
    session = req.session;
    if (req.session.isLoggedIn == 'Y') {
      db.User.findById({ _id: session.userProfile._id }, function(err, data) {
        if (err) {
          res.send(err);
        } else {
          saleKeys = _.keys(data.saleFile);
          purchaseKeys = _.keys(data.purchaseFile);
          _.forEach(saleKeys, function(key) {
            if (key == req.params.month) {
              filteredSaleFileData = data.saleFile[key];
            }
          });
          _.forEach(purchaseKeys, function(key) {
            if (key == req.params.month) {
              filteredPurchaseFileData = data.purchaseFile[key];
            }
          });

          res.send({ filteredSaleFileData: filteredSaleFileData, filteredPurchaseFileData: filteredPurchaseFileData });
        }
      });
    } else {
      res.redirect(500, '/logout');
    }
  }


  updateSaleFile(req, res) {
    let date = req.body.date;
    let sessionEmail = req.session.userProfile.email;
    db.User.findOne({ "email": sessionEmail }).then((user) => {
      if (user.saleFile[date]) {
        _.forEach(user.saleFile[date], function(record) {
          if (record.Invoice_Number == req.body.Invoice_Number) {
            record.Item_Taxable_Value = req.body.Item_Taxable_Value;
            record.CGST_Rate = req.body.CGST_Rate;
            record.CGST_Amount = req.body.CGST_Amount;
            record.SGST_Rate = req.body.SGST_Rate;
            record.SGST_Amount = req.body.SGST_Amount;
            record.IGST_Rate = req.body.IGST_Rate;
            record.IGST_Amount = req.body.IGST_Amount;
            record.TCS = req.body.TCS;
            record.Cess_Rate = req.body.Cess_Rate;
            record.Cess_Amount = req.body.Cess_Amount;
            record.Other_Charges = req.body.Other_Charges;
            record.Roundoff = req.body.Roundoff;
            record.Item_Total_Including_GST = req.body.Item_Total_Including_GST;
          }
        })
      }
      db.User.update({ "_id": req.session.userProfile._id }, { $set: user }).then((response) => {
        res.send({ data: response, message: 'Record updated Successfully' });
      }).catch((error) => {
        res.send(error);
      })
    })
  }

  updatePurchaseFile(req, res) {
    let date = req.body.date;
    let sessionEmail = req.session.userProfile.email;
    db.User.findOne({ "email": sessionEmail }).then((user) => {
      if (user.purchaseFile[date]) {
        _.forEach(user.purchaseFile[date], function(record) {
          if (record.Invoice_Number == req.body.Invoice_Number) {
            record.Item_Taxable_Value = req.body.Item_Taxable_Value;
            record.CGST_Rate = req.body.CGST_Rate;
            record.CGST_Amount = req.body.CGST_Amount;
            record.SGST_Rate = req.body.SGST_Rate;
            record.SGST_Amount = req.body.SGST_Amount;
            record.IGST_Rate = req.body.IGST_Rate;
            record.IGST_Amount = req.body.IGST_Amount;
            record.TCS = req.body.TCS;
            record.Cess_Rate = req.body.Cess_Rate;
            record.Cess_Amount = req.body.Cess_Amount;
            record.Other_Charges = req.body.Other_Charges;
            record.Roundoff = req.body.Roundoff;
            record.Item_Total_Including_GST = req.body.Item_Total_Including_GST;
          }
        })
      }
      db.User.update({ "_id": req.session.userProfile._id }, { $set: user }).then((response) => {
        res.send({ data: response, message: 'Record updated Successfully' })

      }).catch((error) => {
        res.send(error);
      })
    })
  }

  updateContactDetail(req, res) {
    let updatedSaleFileData = req.body.updatedSaleFileData;
    let date = req.body.dateOfFile;
    let sessionEmail = req.session.userProfile.email;
    if (req.session.isLoggedIn == 'Y') {
      db.User.findOne({ "email": sessionEmail }).then((user) => {
        _.forEach(user.saleFile[date], function(storedRecord) {
          if (!storedRecord.Email_Address || !storedRecord.Mobile_Number) {
            let storedInvoiceNo = storedRecord.Invoice_Number;
            _.forEach(updatedSaleFileData, function(updatedRecord) {
              if (updatedRecord.Invoice_Number === storedInvoiceNo) {
                storedRecord.Email_Address = updatedRecord.Email_Address;
                storedRecord.Mobile_Number = updatedRecord.Mobile_Number;
              }
            })
          }
        })
        db.User.update({ "_id": req.session.userProfile._id }, { $set: user }).then((response) => {
          res.send({ data: response, message: 'Contact Details Updated Successfully' })
        }).catch((error) => {
          res.send(error);
        })
      }).catch((err) => {
        return res.send({ message: 'Object Not Found' });
      })
    } else {
      res.redirect(500, '/logout');
    }
  }

  changeStatus(req, res) {
    let date = req.body.date;
    if (req.session.isLoggedIn == 'Y') {
      db.User.findOne({ "GSTNo": req.body.GSTIN }).then((user) => {
        _.forEach(user.saleFile[date], function(record) {
          if (record.Invoice_Number == req.body.Invoice_Number) {
            record.status = req.body.status;
          }
        })
        if (req.body.fromPurchase) {
          _.forEach(user.purchaseFile[date], function(purchaseRecord) {
            if (purchaseRecord.Invoice_Number == req.body.Invoice_Number) {
              purchaseRecord.status = req.body.status;
            }
          })
        }
        db.User.update({ "GSTNo": req.body.GSTIN }, { $set: user }).then((response) => {
          res.send({ data: response, message: 'Status Changed Successfully' })
        }).catch((error) => {
          res.send(error);
        })
      }).catch((err) => {
        return res.send({ message: 'Object Not Found' });
      })
    } else {
      res.redirect(500, '/logout');
    }
  }

  updateClient(req, res) {
    let date = req.body.date;
    let sessionEmail = req.session.userProfile.email;
    db.User.findOne({ "email": sessionEmail }).then((user) => {
      if (user.saleFile[date]) {
        _.forEach(user.saleFile[date], function(record) {
          if (record.Invoice_Number == req.body.Invoice_Number) {
            record.Customer_Billing_Name = req.body.clientCompanyName;
            record.Email_Address = req.body.clientEmail;
            record.Customer_Billing_GSTIN = req.body.clientGSTNo;
            record.Customer_Billing_Address = req.body.clientAddress;
            record.Customer_Billing_State = req.body.clientState;
            record.Customer_Billing_City = req.body.clientCity;
            record.Customer_Billing_PinCode = req.body.clientPincode;
            // record. = req.body.clientOwnerName;
            record.Mobile_Number = req.body.clientMobile;
          }
        })
      }
      db.User.update({ "_id": req.session.userProfile._id }, { $set: user }).then((response) => {
        res.send({ data: response, message: 'Record updated Successfully' })

      }).catch((error) => {
        res.send(error);
      })
    })
  }


}