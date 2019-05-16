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
      _id: {
        type: String,
        required: true
      },
      itemcode: {
        type: String,
        required: true
      },
      /*
      rack: {
        type: String
      },*/
      quantity: {
        type: Number,
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
