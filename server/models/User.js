let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Mixed = Schema.Types.Mixed;
module.exports = (mongoose) => {
  let UserSchema = new Schema({
    companyName: {
      type: String,
      required: [false, 'Company Name is required.']
    },
    address: {
      type: String,
      required: [false, 'Address is required.']
    },
    state: {
      type: String,
      required: [false, 'State is required.']
    },
    city: {
      type: String,
      required: [false, 'City is required.']
    },
    pincode: {
      type: Number,
      required: [false, 'Pincode is required.']
    },
    email: {
      type: String,
      required: [true, 'Email is required.']
    },
    ownerName: {
      type: String,
      required: [false, 'Owner Name is required.']
    },
    mobile1: {
      type: String,
      required: [false, 'Mobile Number is required.']
    },
    mobile2: {
      type: String
    },
    landline: {
      type: String
    },
    panNo: {
      type: String,
      required: [false, 'Pan Number is required.']
    },
    GSTNo: {
      type: String,
      required: [true, 'GSTNo is required.']
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    saleFilePath: {
      type: String
    },
    premiumUser: {
      type: Boolean
    },
    saleFile: {
      type: Mixed
    },
    purchaseFile: {
      type: Mixed
    },
    ResetToken: {
      type: String
    },
    TokenExpire: {
      type: Number
    }
  }, { timestamps: true }, { strict: true });
  return mongoose.model('User', UserSchema);
};