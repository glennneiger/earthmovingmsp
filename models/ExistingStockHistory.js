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
  prodwarehouse: {
    type: String,
    required: true
  },
  prodorigin: {
    type: String
  },
  quantity: {
    type: Number,
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
