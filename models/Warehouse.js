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
  racks: {
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
      rack: {
        type: String
      },
      quantity: {
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
      productImage: [],
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
