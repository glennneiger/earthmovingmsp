const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const SalesOrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  invoiceno: {
    type: String,
    required: true
  },
  orderdate: {
    type: String,
    required: true
  },
  orderedproducts: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      _id: {
        type: String,
        required: true
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
        type: Number,
        required: true
      },
      itemwidth: {
        type: Number,
        required: true
      },
      itemheight: {
        type: Number,
        required: true
      },
      forcompany: {
        type: String,
        required: true
      },
      minrate: {
        type: Number,
        required: true
      },
      rate: {
        type: Number,
        required: true
      },
      maxrate: {
        type: Number,
        required: true
      },
      orderitemquantity: {
        type: Number,
        required: true
      },
      prodbillingwarehouse: {
        type: String,
        required: true
      },
      subtotal: {
        type: String,
        required: true
      },
      itemprimaryimg: {
        type: String,
        required: true
      },
      hsncode: {
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

module.exports = SalesOrder = mongoose.model("salesorder", SalesOrderSchema);
