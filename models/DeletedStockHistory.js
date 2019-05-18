const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create DeletedStockHistorySchema
const DeletedStockHistorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  prodstk_id: {
    type: String,
    required: true
  },
  itemname: {
    type: String
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
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = DeletedStockHistory = mongoose.model(
  "deletedstockhistory",
  DeletedStockHistorySchema
);
