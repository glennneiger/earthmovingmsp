const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const WarehouseSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  warehousename: {
    type: String,
    required: true
  },
  warehouseaddress: {
    type: String,
    required: true
  },
  warehousepincode: {
    type: String
  },
  warehousecity: {
    type: String
  },
  warehousecapacity: {
    type: String
  },
  warehouseImage: {
    type: String
  },
  warehouseproducts: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "users"
      },
      _id: {
        type: String,
        required: true
      },
      itempartno: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      minqtyreqfornotify: {
        type: Number
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

module.exports = Warehouse = mongoose.model("warehouse", WarehouseSchema);
