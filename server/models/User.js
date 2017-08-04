// let mongoose = require('mongoose');
// let Schema = mongoose.Schema;
// module.exports = (mongoose) => {

//   let UserSchema = new Schema({
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
//       required: [true, 'Mobile Number is required.']
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
//       required: [true, 'GSTNo is required.']
//     },
//     password: {
//       type: String,
//       required: [true, 'Password is required.']
//     },
//     file: {
//       type: String
//     }
//   }, { timestamps: true }, { strict: true });
//   return mongoose.model('User', UserSchema);
// };
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Mixed = Schema.Types.Mixed;
module.exports = (mongoose) => {
  let SaleSchema = new Schema({
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
    Type: {
      type: Mixed,
      required: false
    },
    Supply_Type: {
      type: Mixed,
      required: false
    },
    Customer_Billing_Name: {
      type: Mixed,
      required: false
    },
    Customer_Billing_Address: {
      type: Mixed,
      required: false
    },
    Customer_Billing_City: {
      type: Mixed,
      required: false
    },
    Customer_Billing_PinCode: {
      type: Mixed,
      required: false
    },
    Customer_Billing_State: {
      type: Mixed,
      required: false
    },
    Customer_Billing_StateCode: {
      type: Mixed,
      required: false
    },
    Customer_Billing_GSTIN: {
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
    Nil_Rated_Amount: {
      type: Mixed,
      required: false
    },
    Exempted_Amount: {
      type: Mixed,
      required: false
    },
    Non_GST_Amount: {
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
    TCS: {
      type: Mixed,
      required: false
    },
    Cess_Rate: {
      type: Mixed,
      required: false
    },
    Cess_Amount: {
      type: Mixed,
      required: false
    },
    Other_Charges: {
      type: Mixed,
      required: false
    },
    Roundoff: {
      type: Mixed,
      required: false
    },
    Item_Total_Including_GST: {
      type: Mixed,
      required: false
    },
    Taxable_Value_on_which_TCS_has_been_deducted: {
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
    },
  });
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
    saleFilePath: {
      type: String
    },
    saleFile: [SaleSchema]
  }, { timestamps: true }, { strict: true });
  return mongoose.model('User', UserSchema);
};