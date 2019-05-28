const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAddnewStockInput(data) {
  let errors = {};

  data.itemtechname = !isEmpty(data.itemtechname) ? data.itemtechname : "";

  data.itempartno = !isEmpty(data.itempartno) ? data.itempartno : "";
  data.machinenames = !isEmpty(data.machinenames) ? data.machinenames : "";

  data.hsncode = !isEmpty(data.hsncode) ? data.hsncode : "";

  data.itemwarehouse = !isEmpty(data.itemwarehouse) ? data.itemwarehouse : "";

  if (Validator.isEmpty(data.itemwarehouse)) {
    errors.itemwarehouse = "Please Select the Warehouse";
  }
  if (data.itemwarehouse == 0) {
    errors.itemwarehouse = "Please Select the Warehouse";
  }

  if (Validator.isEmpty(data.itemtechname)) {
    errors.itemtechname = "Item Tech Name field is required";
  }
  if (Validator.isEmpty(data.itempartno)) {
    errors.itempartno = "Item Part No field is required";
  }
  if (Validator.isEmpty(data.quantity)) {
    errors.quantity = "Item quantity field is required";
  }
  if (Validator.isEmpty(data.hsncode)) {
    errors.hsncode = "HSN Code field is required";
  }

  if (Validator.isEmpty(data.machinenames)) {
    errors.machinenames = "Machine Names field is required";
  }
  if (!Validator.isNumeric(data.quantity, { no_symbols: true })) {
    errors.quantity =
      "The Quantity Should Be Number or should not contain e.g. +, -, or .";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
