const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const StockSchema = new Schema({
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
    type: String,
    required: true
  },
  itemlength: {
    type: String
  },
  itemwidth: {
    type: String
  },
  itemheight: {
    type: String
  },
  forcompany: {
    type: String
  },
  hsncode: {
    type: String,
    required: true
  },
  minrate: {
    type: String
  },
  rate: {
    type: String
  },
  maxrate: {
    type: String
  },
  itemprimaryimg: {
    type: String
  },
  productImage: [],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Stock = mongoose.model("stock", StockSchema);
