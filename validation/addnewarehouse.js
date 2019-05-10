const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAddnewWarehouseInput(data) {
  let errors = {};

  data.warehousename = !isEmpty(data.warehousename) ? data.warehousename : "";

  data.warehouseaddress = !isEmpty(data.warehouseaddress)
    ? data.warehouseaddress
    : "";

  data.warehousepincode = !isEmpty(data.warehousepincode)
    ? data.warehousepincode
    : "";

  data.warehousecity = !isEmpty(data.warehousecity) ? data.warehousecity : "";

  if (Validator.isEmpty(data.warehousename)) {
    errors.warehousename = "Warehouse Name field is required";
  }

  if (Validator.isEmpty(data.warehouseaddress)) {
    errors.warehouseaddress = "Warehouse Address field is required";
  }

  if (Validator.isEmpty(data.warehousepincode)) {
    errors.warehousepincode = "Warehouse Pincode field is required";
  }

  if (Validator.isEmpty(data.warehousecity)) {
    errors.warehousecity = "Warehouse City field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
