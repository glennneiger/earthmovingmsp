const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create ExistingStockHistorySchema
const ExistingStockHistorySchema = new Schema({
  addonexistingstk: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      prodstk_id: {
        type: String,
        required: true
      },
      itempartno: {
        type: String,
        required: true
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
    }
  ],
  removeonexistingstk: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      prodstk_id: {
        type: String,
        required: true
      },
      itempartno: {
        type: String,
        required: true
      },
      prodwarehouse: {
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
    }
  ],
  editonexistingstk: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      prodstk_id: {
        type: String,
        required: true
      },
      itempartno: {
        type: String,
        required: true
      },
      eidwithunit: {
        type: String
      },
      eodwithunit: {
        type: String
      },
      erate: {
        type: String
      },
      emachinenames: {
        type: String
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
    }
  ]
});

module.exports = ExistingStockHistory = mongoose.model(
  "existingstockhistory",
  ExistingStockHistorySchema
);
