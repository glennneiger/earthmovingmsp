const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const CompanySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  companyname: {
    type: String,
    required: true
  },
  companyaddress: {
    type: String,
    required: true
  },
  companypincode: {
    type: String,
    required: true
  },
  companystate: {
    type: String,
    required: true
  },
  companygstno: {
    type: String,
    required: true
  },
  companyemail: {
    type: String,
    required: true
  },
  companycontactno: {
    type: String,
    required: true
  },
  companycontactperson: {
    type: String,
    required: true
  },
  companywebsite: {
    type: String
  },
  companypanno: {
    type: String,
    required: true
  },
  companybankname: {
    type: String,
    required: true
  },
  companybankaccno: {
    type: String,
    required: true
  },
  companybankbranch: {
    type: String,
    required: true
  },
  companybankifsccode: {
    type: String,
    required: true
  },
  companydeclaration: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Company = mongoose.model("company", CompanySchema);
