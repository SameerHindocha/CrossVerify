// let mongoose = require('mongoose');
// let Schema = mongoose.Schema;
// module.exports = (mongoose) => {

//   var ClientSchema = new Schema({
//     companyName: {
//       type: String,
//       required: [true, 'Company Name is required.']
//     },
//     address: {
//       type: String,
//       required: [true, 'Address is required.']
//     },
//     state: {
//       type: String,
//       required: [true, 'State is required.']
//     },
//     city: {
//       type: String,
//       required: [true, 'City is required.']
//     },
//     pincode: {
//       type: Number,
//       required: [true, 'Pincode is required.']
//     },
//     email: {
//       type: String,
//       required: [true, 'Email is required.']
//     },
//     ownerName: {
//       type: String,
//       required: [true, 'Owner Name is required.']
//     },
//     mobile1: {
//       type: String,
//       required: [true, 'Mobile1 is required.']
//     },
//     mobile2: {
//       type: String
//     },
//     landline: {
//       type: String
//     },
//     panNo: {
//       type: String,
//       required: [true, 'Pan Number is required.']
//     },
//     GSTNo: {
//       type: String,
//       required: [true, 'Gst Number is required.']
//     },
//     userId: {
//       type: String,
//       ref: 'User'
//     },
//     password: {
//       type: String
//     },
//     userKey: {
//       type: String,
//       required: [true, 'User Key is required.']
//     },
//     file: {
//       type: String
//     },
//     fileCompareStatus: {
//       type: Boolean
//     }
//   }, { timestamps: true }, { strict: true });
//   return mongoose.model('Client', ClientSchema);
// };
// 

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Mixed = Schema.Types.Mixed;
module.exports = (mongoose) => {
  let purchaseSchema = new Schema({
    Invoice_Date: {
      type: Mixed,
      required: false
    },
    Invoice_number: {
      type: Mixed,
      required: false
    },
    Invoice_Category: {
      type: Mixed,
      required: false
    },
    Supply_Type: {
      type: Mixed,
      required: false
    },
    Supplier_Name: {
      type: Mixed,
      required: false
    },
    Supplier_Address: {
      type: Mixed,
      required: false
    },
    Supplier_City: {
      type: Mixed,
      required: false
    },
    Supplier_PinCode: {
      type: Mixed,
      required: false
    },
    Supplier_State: {
      type: Mixed,
      required: false
    },
    Supplier_StateCode: {
      type: Mixed,
      required: false
    },
    Supplier_GSTIN: {
      type: Mixed,
      required: false
    },
    Item_Category: {
      type: Mixed,
      required: false
    },
    Item_Total_Before_Discount: {
      type: Mixed,
      required: false
    },
    Item_Discount: {
      type: Mixed,
      required: false
    },
    Item_Taxable_Value: {
      type: Mixed,
      required: false
    },
    CGST_Rate: {
      type: Mixed,
      required: false
    },
    CGST_Amount: {
      type: Mixed,
      required: false
    },
    SGST_Rate: {
      type: Mixed,
      required: false
    },
    SGST_Amount: {
      type: Mixed,
      required: false
    },
    IGST_Rate: {
      type: Mixed,
      required: false
    },
    IGST_Amount: {
      type: Mixed,
      required: false
    },
    CESS_Rate: {
      type: Mixed,
      required: false
    },
    CESS_Amount: {
      type: Mixed,
      required: false
    },
    TCS: {
      type: Mixed,
      required: false
    },
    Item_Total_Including_GST: {
      type: Mixed,
      required: false
    },
    Flag_Reverse_Charge: {
      type: Mixed,
      required: false
    },
    Percent_Reverse_Charge_Rate: {
      type: Mixed,
      required: false
    },
    Reverse_charge_liability: {
      type: Mixed,
      required: false
    },
    Reverse_charge_paid: {
      type: Mixed,
      required: false
    },
    Flag_Cancelled: {
      type: Mixed,
      required: false
    },
    Mobile_number: {
      type: Mixed,
      required: false
    },
    Email_address: {
      type: Mixed,
      required: false
    }
  }, { strict: true });
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
    purchaseFile: purchaseSchema
  }, { timestamps: true }, { strict: true });
  return mongoose.model('Client', ClientSchema);
};