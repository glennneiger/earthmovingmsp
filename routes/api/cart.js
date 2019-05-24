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

    Warehouse.findOne(
      {
        warehouseaddress: prodbillingwarehouse
      },
      //  { "warehouseproducts._id": prodstk_id }
      {
        warehouseproducts: {
          $elemMatch: {
            _id: prodstk_id
          }
        }
      },
      { warehouseproducts: true } //projection true or 1 it means result will return only warehouseproducts acc to above all condition well in case if we set it false or 0 so all the info return except above all condition match warehouseproducts
    )
      .then(warehouse => {
        // console.log("data 1 is : " + warehouse);

        var validationsuccess = false;

        var availquantity = parseInt(warehouse.warehouseproducts[0].quantity);

        console.log("available quantity is : " + availquantity);

        const { errors, isValid } = validateCartInput(
          orderitemquantity,
          availquantity
        );
        // Check Validation
        if (!isValid) {
          validationsuccess = false;
          res.status(400).json(errors);
        } else {
          validationsuccess = true;
        }
        console.log("validationsuccess is " + validationsuccess);
        if (validationsuccess) {
          console.log("all the validation is passed!!");
          console.log(
            "the availquantity is" +
              availquantity +
              "and orderquantity is " +
              orderitemquantity
          );

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
                rate: parseFloat(stock.rate).toFixed(2),
                forremove: [
                  {
                    _id: prodstk_id,
                    prodbillingwarehouse: prodbillingwarehouse
                  }
                ],
                subtotal: parseFloat(stock.rate).toFixed(2) * orderitemquantity
              });

              console.log(
                "Fresh Product Added to session cart" + req.session.cart.length
              );

              console.log(req.session.cart); //here we log the session array
              res.json(req.session.cart);
            });
          } else {
            var cart = req.session.cart;

            var newIteminsert = true;

            var cal = 0;
            var calwithreqorderqty = 0;

            for (var i = 0; i < cart.length; i++) {
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
                newIteminsert = false;
              }
            }
            if (newIteminsert == false) {
              //it means requested order item is already in cart
              console.log("Already existing item order qty in cart " + cal);

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
                // break;
              } else {
                console.log("inside update cart orderitemquantity");

                for (var i = 0; i < cart.length; i++) {
                  if (
                    cart[i]._id == prodstk_id &&
                    cart[i].prodbillingwarehouse == prodbillingwarehouse
                  ) {
                    cart[i].orderitemquantity += orderitemquantity;
                    console.log("order qty updated by" + orderitemquantity);
                    res.json(req.session.cart);
                    newIteminsert = false;
                    //  break;
                  }
                }
                //break;
              }
            } else {
              console.log("the value of newIteminsert is : " + newIteminsert);

              if (newIteminsert) {
                //it means requested order item is new to cart
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
                    rate: parseFloat(stock.rate).toFixed(2),
                    forremove: [
                      {
                        _id: prodstk_id,
                        prodbillingwarehouse: prodbillingwarehouse
                      }
                    ],
                    subtotal:
                      parseFloat(stock.rate).toFixed(2) * orderitemquantity
                  });
                  console.log(
                    "New Product Added to session cart" +
                      req.session.cart.length
                  );

                  res.json(req.session.cart);
                  // break;
                });
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
router.get("/update/:prodstk_id&:prodbillingwarehouse", function(req, res) {
  var prodstk_id = req.params.prodstk_id;

  var prodbillingwarehouse = req.params.prodbillingwarehouse;

  var cart = req.session.cart;

  var action = req.query.action;

  Stock.findOne({ _id: prodstk_id }, function(err, p) {
    if (err) console.log(err);

    //  var totalctn = p.totalctn;

    //console.log("from api" + action);
    for (var i = 0; i < cart.length; i++) {
      if (
        cart[i]._id == prodstk_id &&
        cart[i].prodbillingwarehouse == prodbillingwarehouse
      ) {
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
            console.log("Product Cart Updation Performed");

            res.json(req.session.cart);
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

    //console.log(req.session.cart); //here we log the session array
  });
});

router.post("/updatechangesincart", function(req, res) {
  var cart = req.session.cart;

  var cartstockdtall = req.body;
  console.log("//////working in loop for updating subtotal//////");

  let calsubtotal;

  for (var i = 0; i < cartstockdtall.length; i++) {
    console.log(
      "orderitemquantity of item " +
        i +
        " " +
        "is :" +
        cartstockdtall[i].orderitemquantity
    );
    console.log("rate of item " + i + " " + "is :" + cartstockdtall[i].rate);
    console.log(
      "prev subtotal of item " + i + " " + "is :" + cartstockdtall[i].subtotal
    );

    calsubtotal = parseFloat(
      parseInt(cartstockdtall[i].orderitemquantity) *
        parseFloat(cartstockdtall[i].rate).toFixed(2)
    ).toFixed(2);

    cartstockdtall[i].subtotal = calsubtotal;

    console.log(
      "new subtotal of item " + i + " " + "is :" + cartstockdtall[i].subtotal
    );
  }
  console.log("//////update all subtotal//////");
  //console.log("req.body is : " + req.body);

  // console.log("prev cart is : " + typeof cart);

  //console.log("final edited cart is : " + typeof cartstockdtall);

  req.session.cart = cartstockdtall;

  console.log("final cart is : " + typeof req.session.cart);

  res.json(req.session.cart);
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
