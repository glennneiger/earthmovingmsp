const express = require("express");
const router = express.Router();

// Load Stock Model
const Stock = require("../../models/Stock");
// Load User Model
const User = require("../../models/User");

// Load Warehouse Model
const Warehouse = require("../../models/Warehouse");

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
    var prodstk_id = req.params.prodstk_id;
    // if (prodstk_id) console.log(prodstk_id);

    var prodbillingwarehouse = req.params.prodbillingwarehouse;

    var orderitemquantity = parseInt(req.params.orderitemquantity);
    //  if (orderitemquantity) console.log("quantity recieved" + orderitemquantity);

    console.log(
      "received data is : " + prodstk_id,
      prodbillingwarehouse,
      orderitemquantity
    );

    const errors = {};
    errors.message = "The Product Stock Cannot Added";
    errors.className = "alert-danger";

    Warehouse.findOne({ warehouseaddress: prodbillingwarehouse })
      .then(warehouse => {
        //console.log("billingwarehouse is : "+warehouse);
        console.log(
          "warehouseproductslen is :" + warehouse.warehouseproducts.length
        );
        var warehouseproductslen = warehouse.warehouseproducts.length;

        for (var i = 0; i < warehouseproductslen; i++) {
          if (warehouse.warehouseproducts[i]._id == prodstk_id) {
            console.log("stock _id is :" + warehouse.warehouseproducts[i]._id);
            console.log(
              "stock available quantity is :" +
                warehouse.warehouseproducts[i].quantity
            );
            console.log("order quantity is :" + orderitemquantity);

            var availquantity = parseInt(
              warehouse.warehouseproducts[i].quantity
            );

            /*   const { errors, isValid } = validateCartInput(
              orderitemquantity,
              availquantity
            );
            // Check Validation
            if (!isValid) {
                 return res.status(400).json(errors);
            }
*/
            console.log(
              "the availquantity is" +
                availquantity +
                "and orderquantity is " +
                orderitemquantity
            );
            var validationres = true;

            if (orderitemquantity > availquantity) {
              console.log(
                "Your Order Quantity (" +
                  orderitemquantity +
                  ") Should Be Less Then Available Quantity [" +
                  availquantity +
                  "] Of Product!!"
              );
              errors.message =
                "Your Order Quantity (" +
                orderitemquantity +
                ") Should Be Less Then Available Quantity [" +
                availquantity +
                "] Of Product!!";
              errors.className = "alert-danger";
              validationres = false;
              res.status(400).json(errors);
            } else if (orderitemquantity == 0 || orderitemquantity < 1) {
              console.log("Order Quantity Should Be Greater Then 1");
              errors.message = "Order Quantity Should Be Greater Then 1";
              errors.className = "alert-danger";
              validationres = false;
              res.status(400).json(errors);
            }

            if (validationres) {
              console.log("all the validation pass");
              if (typeof req.session.cart == "undefined") {
                Stock.findOne({ _id: prodstk_id }).then(stock => {
                  req.session.cart = []; //blank array of session in which we store array of object

                  req.session.cart.push({
                    _id: prodstk_id,
                    itemname: stock.itemname,
                    itemcode: stock.itemcode,
                    machinepart: stock.machinepart,
                    itemlength: stock.itemlength,
                    itemwidth: stock.itemwidth,
                    itemheight: stock.itemheight,
                    forcompany: stock.forcompany,
                    hsncode: stock.hsncode,
                    itemprimaryimg: stock.itemprimaryimg,
                    orderitemquantity: orderitemquantity,
                    prodbillingwarehouse: prodbillingwarehouse,
                    rate: parseFloat(stock.rate).toFixed(2)
                  });

                  console.log(
                    "Fresh Product Added to session cart" +
                      req.session.cart.length
                  );

                  console.log(req.session.cart); //here we log the session array
                  res.json(req.session.cart);
                  // break;
                });
              } else {
                var cart = req.session.cart;

                var newIteminsert = true;

                for (var i = 0; i < cart.length; i++) {
                  if (
                    cart[i]._id == prodstk_id &&
                    cart[i].prodbillingwarehouse == prodbillingwarehouse
                  ) {
                    if (cart[i]._id == prodstk_id) {
                      var cal = 0;
                      var calwithreqorderqty = 0;

                      for (var i = 0; i < cart.length; i++) {
                        //  console.log("current i value is : " + i);
                        if (
                          cart[i]._id == prodstk_id &&
                          cart[i].prodbillingwarehouse == prodbillingwarehouse
                        ) {
                          //cal = sum + parseInt(orderitemquantity) + cart[i].orderitemquantity;
                          cal += parseInt(cart[i].orderitemquantity);
                          console.log(
                            "total order qty is : " +
                              cal +
                              " " +
                              "of product stock id :" +
                              prodstk_id
                          );
                        }
                      }
                      console.log(
                        "Already existing item order qty in cart " + cal
                      );

                      calwithreqorderqty = cal + orderitemquantity;

                      console.log(
                        "super total orderqty with requested order qty is : " +
                          calwithreqorderqty
                      );
                      console.log("availquantity is : " + availquantity);

                      console.log(typeof calwithreqorderqty);
                      console.log(typeof availquantity);
                      if (calwithreqorderqty > availquantity) {
                        console.log(
                          "You Cannot Add : " +
                            orderitemquantity +
                            " Quantity of Selected Itemcode Becasue Sum of All Add QTY is EXCEED as compare to Available QTY " +
                            availquantity
                        );
                        errors.message =
                          "You Cannot Add : " +
                          orderitemquantity +
                          " Quantity of Selected Itemcode Becasue Sum of All Add QTY is EXCEED as compare to Available QTY " +
                          availquantity;
                        errors.className = "alert-danger";
                        //  console.log("error is : " + errors);
                        res.status(404).json(errors);
                        console.log(
                          "exit from if statement after check and calculate calwithreqorderqty"
                        );
                        newIteminsert = false;
                        // loopexit = true;
                        break;
                      } else {
                        console.log("inside update cart orderitemquantity");

                        for (var i = 0; i < cart.length; i++) {
                          if (
                            cart[i]._id == prodstk_id &&
                            cart[i].prodbillingwarehouse == prodbillingwarehouse
                          ) {
                            cart[i].orderitemquantity += orderitemquantity;
                            console.log(
                              "order qty updated by" + orderitemquantity
                            );
                            res.json(req.session.cart);
                            newIteminsert = false;
                            break;
                          }
                        }
                        break;
                      }
                    }
                    break;
                  } else {
                    newItemcheckbystkid = true;
                  }
                  console.log("EXIT first loop");
                }

                console.log("the value of newIteminsert is : " + newIteminsert);

                if (newIteminsert) {
                  Stock.findOne({ _id: prodstk_id }).then(stock => {
                    cart.push({
                      _id: prodstk_id,
                      itemname: stock.itemname,
                      itemcode: stock.itemcode,
                      machinepart: stock.machinepart,
                      itemlength: stock.itemlength,
                      itemwidth: stock.itemwidth,
                      itemheight: stock.itemheight,
                      forcompany: stock.forcompany,
                      hsncode: stock.hsncode,
                      itemprimaryimg: stock.itemprimaryimg,
                      orderitemquantity: orderitemquantity,
                      prodbillingwarehouse: prodbillingwarehouse,
                      rate: parseFloat(stock.rate).toFixed(2)
                    });
                    console.log(
                      "New Product Added to session cart" +
                        req.session.cart.length
                    );

                    res.json(req.session.cart);
                    //break;
                  });
                }
              }
            }
          }
        }
      })
      .catch(err => res.status(404).json({ err }));
  }
);

/*
 *GET update product
 */
router.get("/update/:prodstk_id", function(req, res) {
  var prodstk_id = req.params.prodstk_id;

  var cart = req.session.cart;

  var action = req.query.action;

  Stock.findOne({ _id: prodstk_id }, function(err, p) {
    if (err) console.log(err);

    //  var totalctn = p.totalctn;

    //console.log("from api" + action);
    for (var i = 0; i < cart.length; i++) {
      if (cart[i]._id == prodstk_id) {
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
