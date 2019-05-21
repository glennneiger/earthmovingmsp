const express = require("express");
const router = express.Router();

// Load Stock Model
const Stock = require("../../models/Stock");
// Load User Model
const User = require("../../models/User");

const validateCartInput = require("../../validation/cartvalidator");

router.get("/", function(req, res) {
  if (!req.session.cart) {
    res.json(req.session.cart);
    //res.send({ sessioncart: null });
  } else {
    // return res.send({ sessioncart: req.session.cart });
    res.json(req.session.cart);
  }
});

/*
 *GET add product to cart
 */
router.get(
  "/add/:prodstk_id&:prodbillingwarehouse&:orderitemquantity",
  function(req, res) {
    var prostk_id = req.params.prodstk_id;
    // if (prostk_id) console.log(prostk_id);

    var prodbillingwarehouse = req.params.prodbillingwarehouse;

    var orderitemquantity = req.params.orderitemquantity;
    //  if (orderitemquantity) console.log("quantity recieved" + orderitemquantity);

    console.log(
      "received data is : " + prostk_id,
      prodbillingwarehouse,
      orderitemquantity
    );
  }
);

/*
 *GET update product
 */
router.get("/update/:prodstk_id", function(req, res) {
  var prostk_id = req.params.prodstk_id;

  var cart = req.session.cart;

  var action = req.query.action;

  Stock.findOne({ _id: prostk_id }, function(err, p) {
    if (err) console.log(err);

    var totalctn = p.totalctn;

    //console.log("from api" + action);
    for (var i = 0; i < cart.length; i++) {
      if (cart[i]._id == prostk_id) {
        switch (action) {
          case "add":
            var orderitemquantity = cart[i].qty;
            const { errors, isValid } = validateCartInput(
              orderitemquantity,
              totalctn
            );
            // Check Validation
            if (!isValid) {
              //if isValid is not empty its mean errors object has got some errors so in this case it will redirect to the cartproducts
              return res.status(400).json(errors);
            }
            cart[i].qty++;
            break;

          case "dec":
            cart[i].qty--;

            if (cart[i].qty < 1) cart.splice(i, 1);
            break;

          case "delete":
            cart.splice(i, 1);
            if (cart.length == 0) delete req.session.cart;
            break;

          default:
            console.log("update problem");
            break;
        }
        break;
      }
    }

    // req.flash("success", "cart updated");
    //res.redirect("/cart/checkout");

    console.log("Product Cart Updation Performed");

    //console.log(req.session.cart); //here we log the session array
    res.json(req.session.cart);
  });
});
/*
 *GET clear cart
 */
router.get("/clear", function(req, res) {
  delete req.session.cart;

  res.json(req.session.cart);
  // req.flash("success", "cart cleared");
  //res.redirect("/cart/checkout");
});

/*
 *GET buy now
 */
router.get("/buynow", function(req, res) {
  //delete req.session.cart; here we delete the session variable in which selected products are also deleted
  res.sendStatus(200);
});

//Exports
module.exports = router;
