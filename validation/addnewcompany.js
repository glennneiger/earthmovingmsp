const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAddnewCompanyInput(data) {
  let errors = {};

  data.companyname = !isEmpty(data.companyname) ? data.companyname : "";

  data.companyaddress = !isEmpty(data.companyaddress)
    ? data.companyaddress
    : "";

  data.companypincode = !isEmpty(data.companypincode)
    ? data.companypincode
    : "";

  data.companystate = !isEmpty(data.companystate) ? data.companystate : "";

  data.companygstno = !isEmpty(data.companygstno) ? data.companygstno : "";

  data.companyemail = !isEmpty(data.companyemail) ? data.companyemail : "";
  data.companycontactno = !isEmpty(data.companycontactno)
    ? data.companycontactno
    : "";
  data.companycontactperson = !isEmpty(data.companycontactperson)
    ? data.companycontactperson
    : "";
  data.companypanno = !isEmpty(data.companypanno) ? data.companypanno : "";
  data.companybankname = !isEmpty(data.companybankname)
    ? data.companybankname
    : "";
  data.companybankaccno = !isEmpty(data.companybankaccno)
    ? data.companybankaccno
    : "";
  data.companybankbranch = !isEmpty(data.companybankbranch)
    ? data.companybankbranch
    : "";
  data.companybankifsccode = !isEmpty(data.companybankifsccode)
    ? data.companybankifsccode
    : "";
  if (Validator.isEmpty(data.companyname)) {
    errors.companyname = "company Name field is required";
  }

  if (Validator.isEmpty(data.companyaddress)) {
    errors.companyaddress = "company Address field is required";
  }

  if (Validator.isEmpty(data.companypincode)) {
    errors.companypincode = "company Pincode field is required";
  }

  if (Validator.isEmpty(data.companystate)) {
    errors.companystate = "company state field is required";
  }

  if (Validator.isEmpty(data.companygstno)) {
    errors.companygstno = "company gst no field is required";
  }
  if (Validator.isEmpty(data.companyemail)) {
    errors.companyemail = "company email field is required";
  }

  if (Validator.isEmpty(data.companycontactno)) {
    errors.companycontactno = "company contact no field is required";
  }

  if (Validator.isEmpty(data.companycontactperson)) {
    errors.companycontactperson = "company contact person field is required";
  }
  if (Validator.isEmpty(data.companypanno)) {
    errors.companypanno = "company pan number field is required";
  }

  if (Validator.isEmpty(data.companybankname)) {
    errors.companybankname = "company bank name number field is required";
  }
  if (Validator.isEmpty(data.companybankaccno)) {
    errors.companybankaccno = "company bank A/C no field is required";
  }
  if (Validator.isEmpty(data.companypanno)) {
    errors.companypanno = "company pan number field is required";
  }
  if (Validator.isEmpty(data.companybankbranch)) {
    errors.companybankbranch = "company bank branch field is required";
  }
  if (Validator.isEmpty(data.companybankifsccode)) {
    errors.companybankifsccode = "company bank ifsc code field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
