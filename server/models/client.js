let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Mixed = Schema.Types.Mixed;
module.exports = (mongoose) => {
  var ClientSchema = new Schema({
    companyName: {
      type: String,
      required: [true, 'Company Name is required.']
    },
    address: {
      type: String,
      required: [true, 'Address is required.']
    },
    state: {
      type: String,
      required: [true, 'State is required.']
    },
    city: {
      type: String,
      required: [true, 'City is required.']
    },
    pincode: {
      type: Number,
      required: [true, 'Pincode is required.']
    },
    email: {
      type: String,
      required: [true, 'Email is required.']
    },
    ownerName: {
      type: String,
      required: [true, 'Owner Name is required.']
    },
    mobile1: {
      type: String,
      required: [true, 'Mobile1 is required.']
    },
    mobile2: {
      type: String
    },
    landline: {
      type: String
    },
    panNo: {
      type: String,
      required: [true, 'Pan Number is required.']
    },
    GSTNo: {
      type: String,
      required: [true, 'Gst Number is required.']
    },
    userId: {
      type: String,
      ref: 'User'
    },
    password: {
      type: String
    },
    userKey: {
      type: String,
      required: [true, 'User Key is required.']
    },
    purchaseFilePath: {
      type: String
    },
    fileCompareStatus: {
      type: Boolean
    },
    purchaseFile: {
      type: Mixed
    }
  }, { timestamps: true }, { strict: true });
  return mongoose.model('Client', ClientSchema);
};