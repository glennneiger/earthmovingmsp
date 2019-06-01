const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const AddonexisstkhisSchema = new Schema({
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
});

module.exports = Addonexisstkhis = mongoose.model(
  "addonexisstkhis",
  AddonexisstkhisSchema
);
