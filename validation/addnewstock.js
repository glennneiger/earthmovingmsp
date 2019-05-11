const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAddnewStockInput(data) {
  let errors = {};

  data.itemname = !isEmpty(data.itemname) ? data.itemname : "";

  data.itemcode = !isEmpty(data.itemcode) ? data.itemcode : "";
  data.machinepart = !isEmpty(data.machinepart) ? data.machinepart : "";

  data.hsncode = !isEmpty(data.hsncode) ? data.hsncode : "";

  data.itemwarehouse = !isEmpty(data.itemwarehouse) ? data.itemwarehouse : "";

  if (Validator.isEmpty(data.itemwarehouse)) {
    errors.itemwarehouse = "Please Select the Warehouse";
  }
  if (data.itemwarehouse == 0) {
    errors.itemwarehouse = "Please Select the Warehouse";
  }

  if (Validator.isEmpty(data.itemname)) {
    errors.itemname = "Item Name field is required";
  }
  if (Validator.isEmpty(data.itemcode)) {
    errors.itemcode = "Item Code field is required";
  }
  if (Validator.isEmpty(data.quantity)) {
    errors.quantity = "Item quantity field is required";
  }
  if (Validator.isEmpty(data.hsncode)) {
    errors.hsncode = "HSN Code field is required";
  }

  if (Validator.isEmpty(data.machinepart)) {
    errors.machinepart = "Machine Part field is required";
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
