const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create ExistingStockHistorySchema
const ExistingStockHistorySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  prodstk_id: {
    type: String,
    required: true
  },
  itemcode: {
    type: String,
    required: true
  },
  eitemname: {
    type: String
  },
  eitemid: {
    type: Number
  },
  eitemidunit: {
    type: String
  },
  eitemod: {
    type: Number
  },
  eitemodunit: {
    type: String
  },
  eitemlength: {
    type: Number
  },
  eitemlengthunit: {
    type: String
  },
  eitemthickness: {
    type: Number
  },
  eitemthicknessunit: {
    type: String
  },
  emachinepart: {
    type: String
  },
  eforcompany: {
    type: String
  },
  ehsncode: {
    type: String
  },
  eminrate: {
    type: String
  },
  erate: {
    type: String
  },
  emaxrate: {
    type: String
  },
  prodwarehouse: {
    type: String
  },
  prodorigin: {
    type: String
  },
  quantity: {
    type: Number
  },
  itemprimaryimg: {
    type: String,
    required: true
  },
  operation: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = ExistingStockHistory = mongoose.model(
  "existingstockhistory",
  ExistingStockHistorySchema
);
