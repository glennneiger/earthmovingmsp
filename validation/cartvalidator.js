const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCartInput(orderctnquantity, totalctn) {
  let errors = {};
  const className = "";
  console.log(
    "from the cart validator totalctn is" +
      totalctn +
      "and orderquantity is " +
      orderctnquantity
  );

  orderctnquantity = !isEmpty(orderctnquantity) ? orderctnquantity : "";

  totalctn = !isEmpty(totalctn) ? totalctn : "";

  if (parseInt(orderctnquantity) >= parseInt(totalctn)) {
    //if (orderctnquantity >= totalctn) { here value is in string that cause comparison problem
    errors.message =
      "Your CTN Order (" +
      orderctnquantity +
      ") Should Be Less Then Available CTN [" +
      totalctn +
      "] Of Product!!";
    errors.className = "alert-danger";
  }

  if (parseInt(orderctnquantity) == 0 || parseInt(orderctnquantity) < 1) {
    errors.message = "Order Quantity Should Be Greater Then 1";
    errors.className = "alert-danger";
  }

  {
    /*if (!Validator.isNumeric(orderctnquantity)) {
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
