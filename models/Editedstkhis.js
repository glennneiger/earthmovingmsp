const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create EditedstkhisSchema
const EditedstkhisSchema = new Schema({
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
  eitemtechname: {
    type: String
  },
  eitemidwithunit: [],
  eitemodwithunit: [],
  eitemlenwithunit: [],
  eitemthicwithunit: [],
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
});

module.exports = Editedstkhis = mongoose.model(
  "editedstkhis",
  EditedstkhisSchema
);
