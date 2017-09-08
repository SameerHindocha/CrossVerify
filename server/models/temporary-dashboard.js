const mongoose = require('mongoose');
let Schema = mongoose.Schema;
let Mixed = Schema.Types.Mixed;
module.exports = (mongoose) => {
  let TemporaryDashboardSchema = new Schema({
    GSTNo: {
      type: String
    },
    saleFile: {
      type: Mixed
    },
    purchaseFile: {
      type: Mixed
    }
  }, { timestamps: true }, { strict: true });
  return mongoose.model('TemporaryDashboard', TemporaryDashboardSchema);
};