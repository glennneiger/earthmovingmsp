const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const WarehousetransferSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  companyname: {
    type: String
  },
  warehousetransproducts: [
    {
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
      prodwarehouseorigin: {
        type: String,
        required: true
      },
      prodwarehousetransfer: {
        type: String,
        required: true
      },
      quantitytrans: {
        type: Number,
        required: true
      },
      itemprimaryimg: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Warehousetransfer = mongoose.model(
  "warehousetransfer",
  WarehousetransferSchema
);
