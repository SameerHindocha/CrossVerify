let mongoose = require('mongoose');
let Schema = mongoose.Schema;
module.exports = (mongoose) => {

  let UserSchema = new Schema({
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
      required: [true, 'Mobile Number is required.']
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
      required: [true, 'GSTNo is required.']
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    file: {
      type: String
    }
  }, { timestamps: true }, { strict: true });
  return mongoose.model('User', UserSchema);
};
