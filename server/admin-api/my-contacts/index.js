const Utils = require('../../libs/utils.js');
const _ = require('lodash');
const Q = require('q');
let session;
module.exports = class AuthController {
  constructor(app) {
    app.get('/admin-api/get-contact-details', this.getContactDetails);
    app.put('/admin-api/update-basic-contact-details', this.updateContactDetails);
  }

  getContactDetails(req, res) {
    let tempSaleContactList = [];
    let tempPurchaseContactList = [];
    let finalSaleContactList = [];
    let finalPurchaseContactList = [];
    db.User.findById({ _id: req.session.userProfile._id }).then((user) => {
      _.forEach(user.saleFile, function(monthlyData) {
        _.forEach(monthlyData, function(record) {
          let obj = {
            Customer_Billing_Name: record.Customer_Billing_Name,
            Email_Address: record.Email_Address,
            Mobile_Number: record.Mobile_Number,
            Customer_Billing_GSTIN: record.Customer_Billing_GSTIN,
            Type: 'Buyer'
          }
          tempSaleContactList.push(obj);
        });
      });
      _.forEach(user.purchaseFile, function(monthlyData) {
        _.forEach(monthlyData, function(record) {
          let obj = {
            Supplier_Name: record.Supplier_Name,
            Email_Address: record.Email_Address,
            Mobile_Number: record.Mobile_Number,
            Supplier_GSTIN: record.Supplier_GSTIN,
            Type: 'Seller'
          }
          tempPurchaseContactList.push(obj);
        });
      })
      finalSaleContactList = _.uniqBy(tempSaleContactList, 'Customer_Billing_GSTIN');
      finalPurchaseContactList = _.uniqBy(tempPurchaseContactList, 'Supplier_GSTIN');
      res.send({ finalSaleContactList: finalSaleContactList, finalPurchaseContactList: finalPurchaseContactList });
    }).catch((error) => {
      res.send(error);
    })
  }

  updateContactDetails(req, res) {
    let sessionEmail = req.session.userProfile.email;
    let defaultGSTNo = req.body.defaultGSTNo,
      GSTNo = req.body.GSTNo,
      name = req.body.name,
      email = req.body.email,
      mobile = req.body.mobile,
      type = req.body.type;
    db.User.findOne({ "email": sessionEmail }).then((user) => {
      // if (type == 'Buyer') {
      _.forEach(user.saleFile, function(monthlyData) {
        _.forEach(monthlyData, function(record) {
          if (record.Customer_Billing_GSTIN == defaultGSTNo) {
            record.Customer_Billing_Name = name;
            record.Customer_Billing_GSTIN = GSTNo;
            record.Email_Address = email;
            record.Mobile_Number = mobile;
          }
        });
      });
      // }
      // if (type == 'Seller') {
      _.forEach(user.purchaseFile, function(monthlyData) {
        _.forEach(monthlyData, function(record) {
          if (record.Supplier_GSTIN == defaultGSTNo) {
            record.Supplier_Name = name;
            record.Supplier_GSTIN = GSTNo;
            record.Email_Address = email;
            record.Mobile_Number = mobile;
          }
        });
      });
      // }
      db.User.update({ "_id": req.session.userProfile._id }, { $set: user }).then((response) => {
        res.send({ data: user, message: 'Contact Details Updated Successfully' })
      }).catch((error) => {
        res.status(400).send({ message: "Error in updating contact" })
      })
    }).catch((error) => {
      res.status(404).send({ message: 'Object Not Found' });
    })
  }

}