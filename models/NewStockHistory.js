const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create NewStockHistorySchema
const NewStockHistorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  itemtechname: {
    type: String,
    required: true
  },
  itempartno: {
    type: String,
    required: true
  },
  machinenames: {
    type: String
  },
  itemid: {
    type: Number
  },
  itemidunit: {
    type: String
  },
  itemod: {
    type: Number
  },
  itemodunit: {
    type: String
  },
  itemlength: {
    type: Number
  },
  itemlengthunit: {
    type: String
  },
  itemthickness: {
    type: Number
  },
  itemthicknessunit: {
    type: String
  },
  hsncode: {
    type: String,
    required: true
  },
  minrate: {
    type: Number
  },
  rate: {
    type: Number
  },
  maxrate: {
    type: Number
  },
  itemremark: {
    type: String
  },
  itemprimaryimg: {
    type: String
  },
  prodwarehouse: {
    type: String
  },
  productImage: [],
  quantity: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = NewStockHistory = mongoose.model(
  "newstockhistory",
  NewStockHistorySchema
);
