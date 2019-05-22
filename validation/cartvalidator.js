const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCartInput(orderitemquantity, availquantity) {
  let errors = {};
  const className = "";
  console.log(
    "from the cart validator availquantity is" +
      availquantity +
      "and orderquantity is " +
      orderitemquantity
  );

  orderitemquantity = !isEmpty(orderitemquantity) ? orderitemquantity : "";

  availquantity = !isEmpty(availquantity) ? availquantity : "";

  if (parseInt(orderitemquantity) > parseInt(availquantity)) {
    //if (orderitemquantity > availquantity) { here value is in string that cause comparison problem
    errors.message =
      "Your Order Quantity (" +
      orderitemquantity +
      ") Should Be Less Then Available Quantity [" +
      availquantity +
      "] Of Product!!";
    errors.className = "alert-danger";
  }

  if (parseInt(orderitemquantity) == 0 || parseInt(orderitemquantity) < 1) {
    errors.message = "Order Quantity Should Be Greater Then 1";
    errors.className = "alert-danger";
  }

  {
    /*if (!Validator.isNumeric(orderitemquantity)) {
    errors.message = "Your CTN Order Should Be Number eg: 90 or 100";
    errors.className = "alert-danger";
  }
*/
  }

  return {
    errors,
    isValid: isEmpty(errors) //if errors object is empty as we initialize above to at the end of all validation its mean all validation correct in case any validation fail so errors object get fill by its actual validation errors and the errors object not empty anymore then its set the value of isValid and return to the register api with value of isValid.
  };
};
