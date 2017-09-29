const Utils = require('../../libs/utils.js');
const multer = require('multer');
const fs = require('file-system');
const _ = require('lodash');
const XLSX = require('xlsx');
const moment = require('moment');
let session, storage, multerUpload;
const mongoose = require('mongoose');
const async = require('async');

const whilst = 'async/whilst';

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
    app.get('/admin-api/filter-invoices-by-month/:month', this.filterInvoicesByMonth);
    app.post('/admin-api/user', this.insertNewUser);
    app.post('/admin-api/read-file-data', multerUpload.fields([
      { name: 'saleFile', maxCount: 1 },
      { name: 'purchaseFile', maxCount: 1 }
    ]), this.readFileData);
    app.post('/admin-api/check-user', this.checkUserByGST);
    app.put('/admin-api/edit-user', this.updateUser);
    app.put('/admin-api/update-contact-detail', this.updateContactDetail);
    app.put('/admin-api/update-sale-file', this.updateSaleFile);
    app.put('/admin-api/update-purchase-file', this.updatePurchaseFile);
    app.put('/admin-api/change-sale-status', this.changeSaleStatus);
    app.put('/admin-api/change-purchase-status', this.changePurchaseStatus);
    app.put('/admin-api/self-verify', this.selfVerify);
    app.put('/admin-api/update-client-info', this.updateClient);
    app.put('/admin-api/post-file-data', this.insertFileData);
    // app.get('/admin-api/check-user/:gstNo', this.checkUserByGST);
    app.get('/admin-api/check-receiver/:gstNo', this.checkReceiverByGST);
    app.get('/admin-api/change-sale-status-by-mail/:month/:status/:userId/:recordId', this.changeSaleStatusByMail);
    app.get('/admin-api/change-purchase-status-by-mail/:month/:status/:userId/:recordId', this.changePurchaseStatusByMail);
    app.post('/admin-api/auto-verify-sale', this.autoVerifySale);
    app.post('/admin-api/auto-verify-purchase', this.autoVerifyPurchase);
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
    users.landline = postbody.landline;
    users.GSTNo = postbody.GSTNo;
    users.saleFile = postbody.saleFile;
    users.purchaseFile = postbody.purchaseFile;
    users.premiumUser = postbody.premiumUser;
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
      res.json(error);
    });
  }

  getUserbyId(req, res) {
    if (req.session.isLoggedIn == 'Y') {
      session = req.session;
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
    if (session.isLoggedIn == 'Y') {
      let filePath, sessionEmail, updatebody, userRowObject, userFile;
      session = req.session;
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
            user.landline = updatebody.landline;
          }
          user.save()
            .then((user) => {
              req.session.userProfile = user;
              res.status(200).send({ message: "Updated successfully", user: user });
              // db.Client.update({ "email": sessionEmail }, {
              //     $set: {
              //       "address": updatebody.address,
              //       "state": updatebody.state,
              //       "city": updatebody.city,
              //       "pincode": updatebody.pincode,
              //       "ownerName": updatebody.ownerName,
              //       "mobile1": updatebody.mobile1,
              //       "landline": updatebody.landline
              //     }
              //   }, { multi: true })
              //   .then((response) => {

              //   }).catch((error) => {
              //     res.status(404).send({ message: 'Object Not Found' });
              //   })
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

  readFileData(req, res) {
    let saleFile, saleHeaderWorkBook, saleWorkBook, saleData, purchaseFile, purchaseHeaderWorkBook, purchaseWorkBook, purchaseData;
    if (req.session.isLoggedIn == 'Y') {
      if (req.files.saleFile && !req.files.purchaseFile) {
        saleFile = req.files.saleFile[0].path;
        saleHeaderWorkBook = XLSX.readFile(saleFile, { 'sheetRows': 1 });
        let salesHeaderFields = saleHeaderWorkBook.Sheets[saleHeaderWorkBook.SheetNames[0]];
        if (_.size(salesHeaderFields) <= 3) {
          return res.send({ status: '501', message: 'Error in sale file header' })
        }
        delete salesHeaderFields['!fullref'];
        delete salesHeaderFields['!margins'];
        delete salesHeaderFields['!ref'];
        saleWorkBook = XLSX.readFile(saleFile);
        saleData = XLSX.utils.sheet_to_json(saleWorkBook.Sheets[saleWorkBook.SheetNames[0]]);
        res.send({ status: '200', salesHeaderFields: salesHeaderFields, saleData: saleData });
      }
      if (!req.files.saleFile && req.files.purchaseFile) {
        console.log('bckend purchase');
        purchaseFile = req.files.purchaseFile[0].path;
        purchaseHeaderWorkBook = XLSX.readFile(purchaseFile, { 'sheetRows': 1 });
        let purchaseHeaderFields = purchaseHeaderWorkBook.Sheets[purchaseHeaderWorkBook.SheetNames[0]];
        if (_.size(purchaseHeaderFields) <= 3) {
          return res.send({ status: '501', message: 'Error in purchase file header' })
        }
        delete purchaseHeaderFields['!fullref'];
        delete purchaseHeaderFields['!margins'];
        delete purchaseHeaderFields['!ref'];
        purchaseWorkBook = XLSX.readFile(purchaseFile);
        purchaseData = XLSX.utils.sheet_to_json(purchaseWorkBook.Sheets[purchaseWorkBook.SheetNames[0]]);
        res.send({ status: '200', purchaseHeaderFields: purchaseHeaderFields, purchaseData: purchaseData });
      }
      if (req.files.saleFile && req.files.purchaseFile) {
        saleFile = req.files.saleFile[0].path;
        saleHeaderWorkBook = XLSX.readFile(saleFile, { 'sheetRows': 1 });
        let salesHeaderFields = saleHeaderWorkBook.Sheets[saleHeaderWorkBook.SheetNames[0]];
        if (_.size(salesHeaderFields) <= 3) {
          return res.send({ status: '501', message: 'Error in sale file header' })
        }
        delete salesHeaderFields['!fullref'];
        delete salesHeaderFields['!margins'];
        delete salesHeaderFields['!ref'];
        saleWorkBook = XLSX.readFile(saleFile);
        saleData = XLSX.utils.sheet_to_json(saleWorkBook.Sheets[saleWorkBook.SheetNames[0]]);
        purchaseFile = req.files.purchaseFile[0].path;
        purchaseHeaderWorkBook = XLSX.readFile(purchaseFile, { 'sheetRows': 1 });
        let purchaseHeaderFields = purchaseHeaderWorkBook.Sheets[purchaseHeaderWorkBook.SheetNames[0]];
        if (_.size(purchaseHeaderFields) <= 3) {
          return res.send({ status: '501', message: 'Error in purchase file header' })
        }
        delete purchaseHeaderFields['!fullref'];
        delete purchaseHeaderFields['!margins'];
        delete purchaseHeaderFields['!ref'];
        purchaseWorkBook = XLSX.readFile(purchaseFile);
        purchaseData = XLSX.utils.sheet_to_json(purchaseWorkBook.Sheets[purchaseWorkBook.SheetNames[0]]);
        res.send({ status: '200', salesHeaderFields: salesHeaderFields, purchaseHeaderFields: purchaseHeaderFields, saleData: saleData, purchaseData: purchaseData });
      }
    } else {
      res.redirect(500, '/logout');
    }
  }

  insertFileData(req, res) {
    if (req.session.isLoggedIn == 'Y') {
      let date = req.body.date;
      let saleFileData, purchaseFileData;
      if (req.body.newSaleData) {
        saleFileData = req.body.newSaleData;
        _.forEach(saleFileData, function(saleRecord) {
          saleRecord._id = new db.User()._id;
        })
      }
      if (req.body.newPurchaseData) {
        purchaseFileData = req.body.newPurchaseData;
        _.forEach(purchaseFileData, function(purchaseRecord) {
          purchaseRecord._id = new db.User()._id;
        })
      }
      db.User.findById({ _id: req.session.userProfile._id }).then((user) => {
        let obj = {};
        if (_.size(saleFileData)) {
          obj['saleFile.' + date + ''] = saleFileData;
        }
        if (_.size(purchaseFileData)) {
          obj['purchaseFile.' + date + ''] = purchaseFileData;
        }
        db.User.update({ "_id": req.session.userProfile._id }, { $set: obj }).then((response) => {
          res.send({ saleFileData: saleFileData, purchaseFileData: purchaseFileData, message: 'Files uploaded Successfully' })
        }).catch((error) => {
          res.send(error);
        })
      })
    } else {
      res.redirect(500, '/logout');
    }
  }

  filterInvoicesByMonth(req, res) {
    if (req.session.isLoggedIn == 'Y') {
      let filteredSaleFileData = [];
      let filteredPurchaseFileData = [];
      let saleKeys = [];
      let purchaseKeys = [];
      let filterMonth = req.params.month;
      session = req.session;
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


  /* TOP OK */

  /*   OK    */
  updateSaleFile(req, res) {
    if (req.session.isLoggedIn == 'Y') {
      let date = req.body.date;
      let responseData;
      let recordId = req.body.recordId;
      db.User.findById({ _id: req.session.userProfile._id }).then((user) => {
        if (user.saleFile[date]) {
          _.forEach(user.saleFile[date], function(record) {
            if (record._id == recordId) {
              record.Invoice_Number = req.body.Invoice_Number;
              record.Invoice_Date = req.body.Invoice_Date;
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
          _.forEach(user.saleFile[date], function(record) {
            if (record._id == recordId) {
              responseData = record;
            }
          })
          res.send({ data: responseData, saleData: user.saleFile[date], message: 'Record updated Successfully' });
        }).catch((error) => {
          res.send(error);
        })
      })
    } else {
      res.redirect(500, '/logout');
    }
  }

  /*   OK    */
  updatePurchaseFile(req, res) {
    if (req.session.isLoggedIn == 'Y') {
      let date = req.body.date;
      let responseData;
      let recordId = req.body.recordId;
      db.User.findById({ _id: req.session.userProfile._id }).then((user) => {
        if (user.purchaseFile[date]) {
          _.forEach(user.purchaseFile[date], function(record) {
            if (record._id == recordId) {
              record.Invoice_Number = req.body.Invoice_Number;
              record.Invoice_Date = req.body.Invoice_Date;
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
          _.forEach(user.purchaseFile[date], function(record) {
            if (record._id == recordId) {
              responseData = record;
            }
          })
          res.send({ data: responseData, purchaseData: user.purchaseFile[date], message: 'Record updated Successfully' })
        }).catch((error) => {
          res.send(error);
        })
      })
    } else {
      res.redirect(500, '/logout');
    }
  }


  /* TODO? */
  updateContactDetail(req, res) {
    if (req.session.isLoggedIn == 'Y') {
      let updatedSaleFileData = req.body.updatedSaleFileData;
      let updatePurchaseFileData = req.body.updatedPurchaseFileData;
      let date = req.body.dateOfFile;
      let sessionEmail = req.session.userProfile.email;
      db.User.findOne({ "email": sessionEmail }).then((user) => {
        _.forEach(user.saleFile[date], function(storedRecord) {
          if (!storedRecord.Email_Address || !storedRecord.Mobile_Number) {
            let storedGST = storedRecord.Customer_Billing_GSTIN;
            _.forEach(updatedSaleFileData, function(updatedRecord) {
              if (updatedRecord.Customer_Billing_GSTIN == storedGST) { //TODO
                storedRecord.Email_Address = updatedRecord.Email_Address;
                storedRecord.Mobile_Number = updatedRecord.Mobile_Number;
              }
            })
          }
        })
        _.forEach(user.purchaseFile[date], function(storedRecord) {
          if (!storedRecord.Email_Address || !storedRecord.Mobile_Number) {
            let storedGST = storedRecord.Supplier_GSTIN;
            _.forEach(updatePurchaseFileData, function(updatedRecord) {
              if (updatedRecord.Supplier_GSTIN === storedGST) { //TODO
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

  /* OK */
  selfVerify(req, res) {
    let date = req.body.date;
    let salePurchaseStatus = req.body.salePurchaseStatus;
    let recordId = req.body.recordId;
    db.User.findById({ _id: req.session.userProfile._id }).then((user) => {
      if (salePurchaseStatus == 0) {
        _.forEach(user.saleFile[date], function(saleRecord) {
          if (saleRecord._id == req.body.recordId) {
            saleRecord.status = req.body.status;
          }
        })
      }
      if (salePurchaseStatus == 1) {
        _.forEach(user.purchaseFile[date], function(purchaseRecord) {
          if (purchaseRecord._id == req.body.recordId) {
            purchaseRecord.status = req.body.status;
          }
        })
      }
      db.User.update({ "_id": req.session.userProfile._id }, { $set: user }).then((response) => { //DONE Use Email insted of GST
        res.send({ data: response, message: 'Self verification Successfully' })
      }).catch((error) => {
        res.send(error);
      })
    }).catch((err) => {
      return res.send({ message: 'Object Not Found' });
    })
  }

  /* OK */

  updateClient(req, res) {
    if (req.session.isLoggedIn == 'Y') {
      let date = req.body.date;
      let responseData;
      // let sessionEmail = req.session.userProfile.email;
      let flag = req.body.flag;
      db.User.findById({ _id: req.session.userProfile._id }).then((user) => {
        if (flag == 0) {
          if (user.saleFile[date]) {
            _.forEach(user.saleFile[date], function(record) {
              if (record.Customer_Billing_GSTIN == req.body.defaultGSTIN) {
                record.Customer_Billing_Name = req.body.clientCompanyName;
                record.Email_Address = req.body.clientEmail;
                record.Customer_Billing_GSTIN = req.body.clientGSTNo;
                record.Customer_Billing_Address = req.body.clientAddress;
                record.Customer_Billing_State = req.body.clientState;
                record.Customer_Billing_City = req.body.clientCity;
                record.Customer_Billing_PinCode = req.body.clientPincode;
                record.Mobile_Number = req.body.clientMobile;
              }
            })
          }
        }
        if (flag == 1) {
          if (user.purchaseFile[date]) {
            _.forEach(user.purchaseFile[date], function(record) {
              if (record._id == req.body.defaultGSTIN) {
                record.Supplier_Name = req.body.clientCompanyName;
                record.Email_Address = req.body.clientEmail;
                record.Supplier_GSTIN = req.body.clientGSTNo;
                record.Supplier_Address = req.body.clientAddress;
                record.Supplier_State = req.body.clientState;
                record.Supplier_City = req.body.clientCity;
                record.Supplier_PinCode = req.body.clientPincode;
                // record. = req.body.clientOwnerName;
                record.Mobile_Number = req.body.clientMobile;
              }
            })
          }
        }
        db.User.update({ "_id": req.session.userProfile._id }, { $set: user }).then((response) => {
          if (flag == 0) {
            _.forEach(user.saleFile[date], function(record) {
              if (record._id == req.body.recordId) {
                responseData = record;
              }
            })
          } else if (flag == 1) {
            _.forEach(user.purchaseFile[date], function(record) {
              if (record._id == req.body.recordId) {
                responseData = record;
              }
            })
          }
          res.send({ data: responseData, message: 'Record updated Successfully' })
        }).catch((error) => {
          res.send(error);
        })
      })
    } else {
      res.redirect(500, '/logout');
    }
  }
  // checkUserByGST(req, res) {
  //   let gst = req.params.gstNo;
  //   db.User.findOne({ "GSTNo": gst }).then((user) => {
  //     res.send({ user: user });
  //   }).catch((error) => {
  //     res.send(error);
  //   })
  // }
  // 
  checkUserByGST(req, res) {
    let senderGST = req.body.senderGST;
    let receiverGST = req.body.receiverGST;
    let month = req.body.month;
    let category = req.body.category;
    let matchedSaleRecords = [];
    let matchedPurchaseRecords = [];
    db.User.findOne({ "GSTNo": senderGST }).then((user) => {
      if (category == 0) {
        if (user.saleFile[month]) {
          _.forEach(user.saleFile[month], function(record) {
            if (record.Customer_Billing_GSTIN == receiverGST) {
              matchedSaleRecords.push(record);
            }
          })
          res.send({ matchedSaleRecords: matchedSaleRecords, user: user });
        }
      }
      if (category == 1) {
        if (user.purchaseFile[month]) {
          _.forEach(user.purchaseFile[month], function(record) {
            if (record.Supplier_GSTIN == receiverGST) {
              matchedPurchaseRecords.push(record);
            }
          })
          res.send({ matchedPurchaseRecords: matchedPurchaseRecords, user: user });
        }
      }
    }).catch((error) => {
      res.send(error);
    })
  }

  /* OK */
  checkReceiverByGST(req, res) {
    let gst = req.params.gstNo;
    db.User.findOne({ "GSTNo": gst }).then((user) => {
      res.send({ user: user });
    }).catch((error) => {
      res.send(error);
    })
  }

  /* TODO */
  changeSaleStatus(req, res) {
    let date = req.body.date;
    db.User.findOne({ "GSTNo": req.body.currentUserGSTIN }).then((user) => { //TODO
      _.forEach(user.saleFile[date], function(saleRecord) {
        if (saleRecord.Invoice_Number == req.body.Invoice_Number && saleRecord.Customer_Billing_GSTIN == req.body.GSTINOfRecord) { //TODO
          saleRecord.status = req.body.status;
        }
      })
      db.User.update({ "GSTNo": req.body.currentUserGSTIN }, { $set: user }).then((response) => { //TODO
        res.send({ data: response, message: 'Status Changed Successfully' })
      }).catch((error) => {
        res.send(error);
      })
    }).catch((err) => {
      return res.send({ message: 'Object Not Found' });
    })
  }

  /* TODO */
  changePurchaseStatus(req, res) {
    let date = req.body.date;
    db.User.findOne({ "GSTNo": req.body.currentUserGSTIN }).then((user) => {
      _.forEach(user.purchaseFile[date], function(purchaseRecord) {
        if (purchaseRecord.Invoice_Number == req.body.Invoice_Number && purchaseRecord.Supplier_GSTIN == req.body.GSTINOfRecord) {
          purchaseRecord.status = req.body.status;
        }
      })
      db.User.update({ "GSTNo": req.body.currentUserGSTIN }, { $set: user }).then((response) => {
        res.send({ data: response, message: 'Status Changed Successfully' })
      }).catch((error) => {
        res.send(error);
      })
    }).catch((err) => {
      return res.send({ message: 'Object Not Found' });
    })
  }

  /* TODO */
  changeSaleStatusByMail(req, res) {
    let paramsData = req.params;

    let date = paramsData.month;
    let status = paramsData.status;
    db.User.findById(paramsData.userId).then((user) => {
      console.log("date", date);
      _.forEach(user.saleFile[date], function(saleRecord) {
        console.log("saleRecord._id", saleRecord._id);
        console.log("data1.recordId", paramsData.recordId);
        if (saleRecord._id == paramsData.recordId) {
          saleRecord.status = status;
          console.log("saleRecord.status", saleRecord.status);
        }
      })
      db.User.update({ "_id": paramsData.userId }, { $set: user }).then((response) => {
        // res.redirect('/logout');
        res.send();
      }).catch((error) => {
        console.log("error >: ", error);
        res.send(error);
      })
    }).catch((err) => {
      console.log("err", err);
      res.send({ message: 'Object Not Found' });
    })
  }


  /* TODO */
  changePurchaseStatusByMail(req, res) {
    console.log('req.body', req.params);
    let paramsData = req.params;
    let date = paramsData.month;
    let status = paramsData.status;
    db.User.findById(paramsData.userId).then((user) => {
      console.log("user._id", user._id);

      _.forEach(user.purchaseFile[date], function(purchaseRecord) {
        console.log("purchaseRecord._id ", purchaseRecord._id);
        console.log("paramsData.recordId", paramsData.recordId);
        if (purchaseRecord._id == paramsData.recordId) {
          purchaseRecord.status = status;
          console.log("purchaseRecord.status", purchaseRecord.status);
        }
      })
      db.User.update({ "_id": paramsData.userId }, { $set: user }).then((response) => {
        res.send();
        // res.send({ data: response, message: 'Status Changed Successfully' })
      }).catch((error) => {
        res.send(error);
      })
    }).catch((err) => {
      return res.send({ message: 'Object Not Found' });
    })
  }

  autoVerifySale(req, res) {
    let matchRecordArray = [];
    let autoVerifySaleArray = req.body;
    let date;
    let editInvoiceArray = [];
    let allUserArray;
    let indexofRecord;
    let editCurrentUser;

    db.User.find('GSTNo').then((userArray) => {
      allUserArray = userArray;
      _.forEach(autoVerifySaleArray, function(autoVerifySaleObj) {
        _.forEach(userArray, function(userObj) {
          // let abc = _.map(_.map(userArray, 'purchaseFile'), autoVerifySaleObj.date);
          let obj;
          if (userObj.purchaseFile[autoVerifySaleObj.date]) {
            date = autoVerifySaleObj.date;
            obj = _.find(userObj.purchaseFile[autoVerifySaleObj.date], function(o) {
              return o.Supplier_GSTIN === autoVerifySaleObj.currentUserGSTIN;
            });
            indexofRecord = _.findIndex(userObj.purchaseFile[autoVerifySaleObj.date], function(o) {
              return o.Supplier_GSTIN === autoVerifySaleObj.currentUserGSTIN;
            });
          }
          // obj = _.remove(obj, null);
          if (obj != null) {
            if (obj.Invoice_Number === autoVerifySaleObj.Invoice_Number) {
              let invoiceObject;
              if (obj.CGST_Amount === autoVerifySaleObj.CGST_Amount && obj.SGST_Amount === autoVerifySaleObj.SGST_Amount && obj.IGST_Amount === autoVerifySaleObj.IGST_Amount && obj.Item_Total_Including_GST === autoVerifySaleObj.Item_Total_Including_GST) {
                let recordIndex = obj.findIndex;
                invoiceObject = {
                  date: autoVerifySaleObj.date,
                  Invoice_Number: obj.Invoice_Number,
                  saleRecordId: autoVerifySaleObj._id,
                  purchaseRecordId: obj._id,
                  GSTIN: obj.Supplier_GSTIN,
                  status: 'verified',
                  userGSTIN: autoVerifySaleObj.GSTINOfRecord,
                  indexOfPurchaseRecord: indexofRecord
                }
              } else {
                invoiceObject = {
                  date: autoVerifySaleObj.date,
                  Invoice_Number: obj.Invoice_Number,
                  saleRecordId: autoVerifySaleObj._id,
                  purchaseRecordId: obj._id,
                  GSTIN: obj.Supplier_GSTIN,
                  status: 'mismatched',
                  userGSTIN: autoVerifySaleObj.GSTINOfRecord,
                  indexOfPurchaseRecord: indexofRecord
                }
              }
              editInvoiceArray.push(invoiceObject);
            }
          }
        })
      })
    }).then(() => {
      _.forEach(editInvoiceArray, function(editInvoiceObj) {
        _.forEach(allUserArray, function(userObj) {
          let key = editInvoiceObj.indexOfPurchaseRecord;
          if (userObj.purchaseFile[date]) {
            if (userObj.purchaseFile[date][key]) {
              if (editInvoiceObj.purchaseRecordId === userObj.purchaseFile[date][key]._id) {
                db.User.findOne({ "GSTNo": editInvoiceObj.userGSTIN }).then((user) => {
                  user.purchaseFile[date][key].status = editInvoiceObj.status;
                  db.User.update({ "GSTNo": editInvoiceObj.userGSTIN }, {
                    $set: user
                  }).then((response) => {
                    console.log("response", response);
                  }).catch((error) => {
                    console.log("error", error);
                  })
                })
              }
            }
          }
        })
      })
    }).then(() => {
      db.User.findOne({ "GSTNo": autoVerifySaleArray[0].currentUserGSTIN }).then((currentUser) => {
        console.log("currentUser", currentUser);
        _.forEach(editInvoiceArray, function(editInvoiceObj) {
          _.forEach(currentUser.saleFile[date], function(invoiceOfMonth, index) {
            if (editInvoiceObj.saleRecordId == invoiceOfMonth._id) {
              currentUser.saleFile[date][index].status = editInvoiceObj.status;
            }
          })
        })
        db.User.update({ "GSTNo": autoVerifySaleArray[0].currentUserGSTIN }, {
          $set: currentUser
        }).then((response) => {
          console.log("response--------", response);
          res.send({ message: "Auto Verification done successful" });
        }).catch((error) => {
          console.log("error", error);
        })
      })
    })
  }

  autoVerifyPurchase(req, res) {
    let matchRecordArray = [];
    let autoVerifyPurchaseArray = req.body;
    let date;
    let editInvoiceArray = [];
    let allUserArray;
    let indexofRecord;
    let editCurrentUser;

    db.User.find('GSTNo').then((userArray) => {
      allUserArray = userArray;
      _.forEach(autoVerifyPurchaseArray, function(autoVerifyPurchaseObj) {
        _.forEach(userArray, function(userObj) {
          let obj, s_user;
          if (userObj.saleFile[autoVerifyPurchaseObj.date]) {
            date = autoVerifyPurchaseObj.date;
            obj = _.find(userObj.saleFile[autoVerifyPurchaseObj.date], function(o) {
              return o.Customer_Billing_GSTIN === autoVerifyPurchaseObj.currentUserGSTIN;
            });
            indexofRecord = _.findIndex(userObj.saleFile[autoVerifyPurchaseObj.date], function(o) {
              return o.Customer_Billing_GSTIN === autoVerifyPurchaseObj.currentUserGSTIN;
            });
          }
          if (obj != null) {
            obj.userGSTIN = userObj.GSTNo;
            if (obj.Invoice_Number === autoVerifyPurchaseObj.Invoice_Number && obj.userGSTIN === autoVerifyPurchaseObj.GSTINOfRecord) {
              let invoiceObject;
              if (obj.CGST_Amount === autoVerifyPurchaseObj.CGST_Amount && obj.SGST_Amount === autoVerifyPurchaseObj.SGST_Amount && obj.IGST_Amount === autoVerifyPurchaseObj.IGST_Amount && obj.Item_Total_Including_GST === autoVerifyPurchaseObj.Item_Total_Including_GST) {
                let recordIndex = obj.findIndex;
                invoiceObject = {
                  date: autoVerifyPurchaseObj.date,
                  Invoice_Number: obj.Invoice_Number,
                  purchaseRecordId: autoVerifyPurchaseObj._id,
                  saleRecordId: obj._id,
                  GSTIN: obj.Customer_Billing_GSTIN,
                  status: 'verified',
                  userGSTIN: autoVerifyPurchaseObj.GSTINOfRecord,
                  indexOfPurchaseRecord: indexofRecord
                }
              } else {
                invoiceObject = {
                  date: autoVerifyPurchaseObj.date,
                  Invoice_Number: obj.Invoice_Number,
                  purchaseRecordId: autoVerifyPurchaseObj._id,
                  saleRecordId: obj._id,
                  GSTIN: obj.Customer_Billing_GSTIN,
                  status: 'mismatched',
                  userGSTIN: autoVerifyPurchaseObj.GSTINOfRecord,
                  indexOfPurchaseRecord: indexofRecord
                }
              }
              editInvoiceArray.push(invoiceObject);
            }
          }
        })
      })
    }).then(() => {
      _.forEach(editInvoiceArray, function(editInvoiceObj) {
        _.forEach(allUserArray, function(userObj) {
          let key = editInvoiceObj.indexOfPurchaseRecord;
          if (userObj.saleFile[date]) {
            if (userObj.saleFile[date][key]) {
              console.log("editInvoiceObj.saleRecordId", editInvoiceObj.saleRecordId);
              console.log("userObj.saleFile[date][key]._id", userObj.saleFile[date][key]._id);
              if (editInvoiceObj.saleRecordId === userObj.saleFile[date][key]._id) {
                db.User.findOne({ "GSTNo": editInvoiceObj.userGSTIN }).then((user) => {
                  console.log("user--- FOUND---", user);
                  user.saleFile[date][key].status = editInvoiceObj.status;
                  db.User.update({ "GSTNo": editInvoiceObj.userGSTIN }, {
                    $set: user
                  }).then((response) => {
                    console.log("response", response);
                  }).catch((error) => {
                    console.log("error", error);
                  })
                })
              }
            }
          }
        })
      })
    }).then(() => {
      db.User.findOne({ "GSTNo": autoVerifyPurchaseArray[0].currentUserGSTIN }).then((currentUser) => {
        _.forEach(editInvoiceArray, function(editInvoiceObj) {
          _.forEach(currentUser.purchaseFile[date], function(invoiceOfMonth, index) {
            if (editInvoiceObj.purchaseRecordId == invoiceOfMonth._id) {
              currentUser.purchaseFile[date][index].status = editInvoiceObj.status;
            }
          })
        })
        db.User.update({ "GSTNo": autoVerifyPurchaseArray[0].currentUserGSTIN }, {
          $set: currentUser
        }).then((response) => {
          console.log("response--------", response);
          res.send({ message: "Auto Verification done successful" });
        }).catch((error) => {
          console.log("error", error);
        })
      })
    })
  }


}

/*

 */