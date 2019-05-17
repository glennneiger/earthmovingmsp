const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create NewStockHistorySchema
const NewStockHistorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  itemname: {
    type: String,
    required: true
  },
  itemcode: {
    type: String,
    required: true
  },
  machinepart: {
    type: String
  },
  itemlength: {
    type: Number
  },
  itemwidth: {
    type: Number
  },
  itemheight: {
    type: Number
  },
  forcompany: {
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
  itemprimaryimg: {
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
