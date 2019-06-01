const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create RemoveonexisstkhisSchema
const RemoveonexisstkhisSchema = new Schema({
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
});

module.exports = Removeonexisstkhis = mongoose.model(
  "removeonexisstkhis",
  RemoveonexisstkhisSchema
);
