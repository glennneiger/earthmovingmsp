const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const multer = require("multer");
const path = require("path");

// Load Stock Model
const Stock = require("../../models/Stock");
// Load User Model
const User = require("../../models/User");

// Load Warehousetransfer Model
const Warehousetransfer = require("../../models/Warehousetransfer");

// Load Warehouse Model
const Warehouse = require("../../models/Warehouse");

router.get("/", function(req, res) {
  if (!req.session.warehousetransfer) {
    res.json(req.session.warehousetransfer);
    //res.send({ sessioncart: null });
  } else {
    // return res.send({ sessioncart: req.session.cart });
    res.json(req.session.warehousetransfer);
  }
});

/*
 *GET add product to warehousetransfer
 */
router.get(
  "/addinlist/:prodstk_id&:prodwarehouseorigin&:prodwarehousetransfer&:quantitytrans", //here we can pass multiple middlewares like for upload and authentication
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    // if (prostk_id) console.log(prostk_id);
    var prodstk_id = req.params.prodstk_id;
    var prodwarehouseorigin = req.params.prodwarehouseorigin;
    var prodwarehousetransfer = req.params.prodwarehousetransfer;
    var quantitytrans = parseInt(req.params.quantitytrans);

    var itempartno;

    var availabletotalqty = 0;

    console.log(
      "received data is :" + prodstk_id,
      prodwarehouseorigin,
      prodwarehousetransfer,
      quantitytrans
    );

    const errors = {};
    errors.message = "The Product Stock Cannot ADD in Transfer list";
    errors.className = "alert-danger";

    Warehouse.findOne(
      {
        warehouseaddress: prodwarehouseorigin
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
        var itempartno = warehouse.warehouseproducts[0].itempartno;
        var availquantity = parseInt(warehouse.warehouseproducts[0].quantity);

        console.log("available quantity is : " + availquantity);

        if (
          parseInt(availquantity) <= 0 ||
          parseInt(availquantity) < parseInt(quantitytrans)
        ) {
          console.log(
            "you cannot transfer product stock from " +
              prodwarehouseorigin +
              " " +
              "Because There are " +
              availquantity +
              " Quantity " +
              "of" +
              itempartno
          );
          errors.message =
            "you cannot transfer product stock from " +
            prodwarehouseorigin +
            " " +
            "Because There are " +
            availquantity +
            " Quantity " +
            "of " +
            itempartno;
          errors.className = "alert-danger";
          res.status(400).json(errors);
        } else {
          var itempartno = warehouse.warehouseproducts[0].itempartno;
          var availquantity = parseInt(warehouse.warehouseproducts[0].quantity);

          if (typeof req.session.warehousetransfer == "undefined") {
            Stock.findOne({ _id: prodstk_id }).then(stock => {
              req.session.warehousetransfer = []; //blank array of session in which we store array of object

              req.session.warehousetransfer.push({
                _id: prodstk_id,
                itempartno: itempartno,
                prodwarehouseorigin: prodwarehouseorigin,
                prodwarehousetransfer: prodwarehousetransfer,
                itemprimaryimg: stock.itemprimaryimg,
                quantitytrans: quantitytrans,
                forremovepurpose: [
                  {
                    _id: prodstk_id,
                    itempartno: itempartno,
                    prodwarehouseorigin: prodwarehouseorigin,
                    prodwarehousetransfer: prodwarehousetransfer,
                    quantitytrans: quantitytrans
                  }
                ]
              });

              console.log(
                "Fresh Product Added to session warehousetransfer" +
                  req.session.warehousetransfer.length
              );

              console.log(req.session.warehousetransfer); //here we log the session array
              res.json(req.session.warehousetransfer);
            });
          } else {
            var warehousetransfer = req.session.warehousetransfer;

            var newIteminsert = true;

            var cal = 0;
            var calwithreqtransqty = 0;
            for (var i = 0; i < warehousetransfer.length; i++) {
              if (
                warehousetransfer[i]._id == prodstk_id &&
                warehousetransfer[i].prodwarehouseorigin ==
                  prodwarehouseorigin &&
                warehousetransfer[i].prodwarehousetransfer ==
                  prodwarehousetransfer
              ) {
                //cal = sum + parseInt(quantitytrans) + cart[i].quantitytrans;
                cal += warehousetransfer[i].quantitytrans;
                console.log(
                  "total transfer qty is : " +
                    cal +
                    " " +
                    "of product stock id :" +
                    prodstk_id
                );
                newIteminsert = false;
              }
            }
            if (newIteminsert == false) {
              //it means requested transfer item is already in warehousetransfer
              console.log(
                "Already existing item transfer qty in warehousetransfer " + cal
              );

              calwithreqtransqty = cal + quantitytrans;

              console.log(
                "super total transferqty with requested transfer qty is : " +
                  calwithreqtransqty
              );
              console.log("availquantity is : " + availquantity);

              console.log(typeof calwithreqtransqty);
              console.log(typeof availquantity);

              if (calwithreqtransqty > availquantity) {
                console.log(
                  "You Cannot Add : " +
                    quantitytrans +
                    " Quantity of Selected Itemcode Becasue Sum of All Add QTY is EXCEED as compare to Available QTY " +
                    availquantity
                );
                errors.message =
                  "You Cannot Add : " +
                  quantitytrans +
                  " Quantity of Selected Itemcode Becasue Sum of All Add QTY is EXCEED as compare to Available QTY " +
                  availquantity;
                errors.className = "alert-danger";
                //  console.log("error is : " + errors);
                res.status(404).json(errors);
                console.log(
                  "exit from if statement after check and calculate calwithreqtransqty"
                );
                newIteminsert = false;
                // loopexit = true;
                // break;
              } else {
                console.log("inside update warehousetransfer quantitytrans");
                for (var i = 0; i < warehousetransfer.length; i++) {
                  if (
                    warehousetransfer[i]._id == prodstk_id &&
                    warehousetransfer[i].prodwarehouseorigin ==
                      prodwarehouseorigin &&
                    warehousetransfer[i].prodwarehousetransfer ==
                      prodwarehousetransfer
                  ) {
                    warehousetransfer[i].quantitytrans += quantitytrans;
                    console.log("transfer qty updated by" + quantitytrans);
                    res.json(req.session.warehousetransfer);
                    newIteminsert = false;
                    //  break;
                  }
                }
              }
            } else {
              console.log("the value of newIteminsert is : " + newIteminsert);
              if (newIteminsert) {
                //it means requested order item is new to warehousetransfer
                Stock.findOne({ _id: prodstk_id }).then(stock => {
                  warehousetransfer.push({
                    _id: prodstk_id,
                    itempartno: itempartno,
                    prodwarehouseorigin: prodwarehouseorigin,
                    prodwarehousetransfer: prodwarehousetransfer,
                    itemprimaryimg: stock.itemprimaryimg,
                    quantitytrans: quantitytrans,
                    forremovepurpose: [
                      {
                        _id: prodstk_id,
                        itempartno: itempartno,
                        prodwarehouseorigin: prodwarehouseorigin,
                        prodwarehousetransfer: prodwarehousetransfer,
                        quantitytrans: quantitytrans
                      }
                    ]
                  });
                  console.log(
                    "New Product Added to session warehousetransfer" +
                      req.session.warehousetransfer.length
                  );

                  res.json(req.session.warehousetransfer);
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
 *GET update product in warehouse transfer
 */
router.get(
  "/update/:prodstk_id&:prodwarehouseorigin&:prodwarehousetransfer&:quantitytrans", //here we can pass multiple middlewares like for upload and authentication
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    var prodstk_id = req.params.prodstk_id;
    var prodwarehouseorigin = req.params.prodwarehouseorigin;
    var prodwarehousetransfer = req.params.prodwarehousetransfer;
    var quantitytrans = req.params.quantitytrans;

    var action = req.query.action;
    var warehousetransfer = req.session.warehousetransfer;

    console.log(
      prodstk_id,
      prodwarehouseorigin,
      prodwarehousetransfer,
      quantitytrans,
      action
    );

    //console.log("from api" + action);
    for (var i = 0; i < warehousetransfer.length; i++) {
      if (
        warehousetransfer[i]._id == prodstk_id &&
        warehousetransfer[i].prodwarehouseorigin == prodwarehouseorigin &&
        warehousetransfer[i].prodwarehousetransfer == prodwarehousetransfer
      ) {
        switch (
          action //in our case we use only delete case nothing else add,dec
        ) {
          case "add":
            var orderctnquantity = warehousetransfer[i].qty;
            const { errors, isValid } = validatewarehousetransferInput(
              orderctnquantity,
              totalctn
            );
            // Check Validation
            if (!isValid) {
              //if isValid is not empty its mean errors object has got some errors so in this case it will redirect to the warehousetransferproducts
              return res.status(400).json(errors);
            }
            warehousetransfer[i].qty++;
            break;

          case "dec":
            warehousetransfer[i].qty--;

            if (warehousetransfer[i].qty < 1) warehousetransfer.splice(i, 1);
            break;

          case "delete":
            warehousetransfer.splice(i, 1);
            if (warehousetransfer.length == 0)
              delete req.session.warehousetransfer;

            console.log("Product warehousetransfer Updation Performed");
            console.log("type is " + typeof req.session.warehousetransfer);
            res.json(req.session.warehousetransfer);
            break;

          default:
            console.log("update problem");
            break;
        }
        break;
      }
    }
  }
);

router.post(
  "/addnewwarehousetransfer", //here we can pass multiple middlewares like for upload and authentication
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    console.log("Ready to work on warehouse transfer finally");

    var warehousetransfer = req.session.warehousetransfer;
    console.log(
      "warehousetransfer final transfer items is :" + warehousetransfer
    );
    const errors = {};
    errors.message = "Sorry, Something Went Wrong !!";
    errors.className = "alert-danger";
    let isWarehouseUpdate = true;
    const watchOriginUpdate = new Promise((resolve, reject) => {
      if (isWarehouseUpdate) {
        let loopdone = 0;
        console.log("////ORIGIN UPDATE START/////////");
        for (i = 0; i < warehousetransfer.length; i++) {
          console.log(
            "Enter inside warehousetransfer loop FOR Origin where working on index no :" +
              i
          );
          let prodstk_id = warehousetransfer[i]._id;
          let itempartno = warehousetransfer[i].itempartno;
          let prodwarehouseorigin = warehousetransfer[i].prodwarehouseorigin;
          let prodwarehousetransfer =
            warehousetransfer[i].prodwarehousetransfer;
          let quantitytrans = warehousetransfer[i].quantitytrans;
          let itemprimaryimg = warehousetransfer[i].itemprimaryimg;
          Warehouse.findOne(
            {
              warehouseaddress: prodwarehouseorigin
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
              if (warehouse) {
                var itempartno = warehouse.warehouseproducts[0].itempartno;
                var availquantity = parseInt(
                  warehouse.warehouseproducts[0].quantity
                );

                console.log("available quantity is : " + availquantity);
                if (
                  parseInt(availquantity) <= 0 ||
                  parseInt(availquantity) < parseInt(quantitytrans)
                ) {
                  console.log(
                    "you cannot transfer product stock from " +
                      prodwarehouseorigin +
                      " " +
                      "Because There are " +
                      availquantity +
                      " Quantity " +
                      "of" +
                      itempartno
                  );
                  errors.message =
                    "you cannot transfer product stock from " +
                    prodwarehouseorigin +
                    " " +
                    "Because There are " +
                    availquantity +
                    " Quantity " +
                    "of " +
                    itempartno;
                  errors.className = "alert-danger";
                  res.status(400).json(errors);
                  return reject(errors);
                } else {
                  warehouse.warehouseproducts[0].quantity -= quantitytrans;
                  console.log(
                    "transfer qty updated(deduction) by" +
                      quantitytrans +
                      " of itempartno : " +
                      itempartno +
                      " at warehouseorigin is : " +
                      prodwarehouseorigin
                  );

                  warehouse.save().then(res => {
                    console.log("deduction saved item successfully!!");
                  });
                }
              }
            })
            .catch(err => {
              console.log("Error is : " + err);
              return reject(errors);
            });

          loopdone++;
          if (loopdone == warehousetransfer.length) {
            console.log("////ORIGIN UPDATE END/////////");
            return resolve("Warehouse Update Successfully");
          }
        }
      } else {
        errors.message = "Sorry, Something Went Wrong";
        errors.className = "alert-danger";
        //  var reason = new Error("Sorry, Warehouse Origin is Not Updated");
        return reject(errors);
      }
    });

    const watchTransferUpdate = new Promise((resolve, reject) => {
      if (isWarehouseUpdate) {
        let loopdonet = 0;
        console.log("////TRANSFER UPDATE START/////////");

        for (w = 0; w < warehousetransfer.length; w++) {
          console.log(
            "Enter inside warehousetransfer loop FOR Transfer where working on index no :" +
              w
          );
          let prodstk_id = warehousetransfer[w]._id;
          let itempartno = warehousetransfer[w].itempartno;
          let prodwarehouseorigin = warehousetransfer[w].prodwarehouseorigin;
          let prodwarehousetransfer =
            warehousetransfer[w].prodwarehousetransfer;
          let quantitytrans = warehousetransfer[w].quantitytrans;
          let itemprimaryimg = warehousetransfer[w].itemprimaryimg;
          Warehouse.findOne(
            {
              warehouseaddress: prodwarehousetransfer
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
              if (warehouse.warehouseproducts.length === 0) {
                console.log(
                  "Ready to Insert New Item Entry with Quantity in warehouse is : " +
                    warehousetransfer[w].prodwarehousetransfer
                );
                console.log(
                  "the value of warehouseproducts is : " +
                    warehouse.warehouseproducts.length
                );
                Warehouse.findOne({
                  warehouseaddress: warehousetransfer[w].prodwarehousetransfer
                }).then(warehouse => {
                  console.log(
                    "Ready to Insert New Item Entry with Quantity in warehouse is : " +
                      warehousetransfer[w].prodwarehousetransfer
                  );
                  console.log(
                    "here we unshift the current itempartno info with quantity in requested warehouse"
                  );
                  console.log("req.user.id is : " + req.user.id);
                  const warehouseprodfields = {
                    user: req.user.id,
                    _id: warehousetransfer[w]._id,
                    itempartno: warehousetransfer[w].itempartno,
                    quantity: warehousetransfer[w].quantitytrans
                  };
                  // Add to warehouseproducts array
                  warehouse.warehouseproducts.unshift(warehouseprodfields);
                  warehouse
                    .save()
                    .then(warehouse => {
                      console.log("New Entry Of Add New Stock Inserted");
                    })
                    .catch(err => {
                      console.log("Error is : " + err);
                      return reject(errors);
                    });
                });
              } else {
                console.log(
                  "Item Already Exist at Warehouse Transfer " +
                    warehousetransfer[w].prodwarehousetransfer
                );
                var itempartno = warehouse.warehouseproducts[0].itempartno;
                var availquantity = parseInt(
                  warehouse.warehouseproducts[0].quantity
                );

                console.log("available quantity is : " + availquantity);

                warehouse.warehouseproducts[0].quantity += quantitytrans;
                console.log(
                  "transfer qty updated(Addition) by" +
                    quantitytrans +
                    " of itempartno : " +
                    itempartno +
                    " at warehouseorigin is : " +
                    prodwarehousetransfer
                );

                warehouse.save().then(res => {
                  console.log("Addition saved item successfully!!");
                });
              }
            })
            .catch(err => {
              console.log("Error is : " + err);
              return reject(errors);
            });

          loopdonet++;
          if (loopdonet == warehousetransfer.length) {
            console.log("////TRANSFER UPDATE END/////////");
            return resolve("Warehouse Update Successfully");
          }
        }
      } else {
        errors.message = "Sorry, Something Went Wrong";
        errors.className = "alert-danger";
        //  var reason = new Error("Sorry, Warehouse Origin is Not Updated");
        return reject(errors);
      }
    });

    const askUpdated = async () => {
      const result = (await watchOriginUpdate) && (await watchTransferUpdate);
      return result;
    };
    askUpdated()
      .then(result => {
        // delete req.session.warehousetransfer;
        console.log(result);

        console.log("FINALLY READY TO SAVE TRANSFER HISTORY");
        var companynamedata = {};
        companynamedata.companyname = "ATOZ COMPANY";

        new Warehousetransfer(companynamedata)
          .save()
          .then(warehousetransfer => {
            console.log("history warehouse transfer save!!");
            const wtransproddt = {
              user: req.user.id
            };

            // Add to warehousetransproducts array
            warehousetransfer.warehousetransproducts.unshift(wtransproddt);
            warehousetransfer.save().then(warehousetransfer => {
              var warehousetransferses = req.session.warehousetransfer;

              for (var fwt = 0; fwt < warehousetransferses.length; fwt++) {
                const translist = {
                  _id: warehousetransferses[fwt]._id,
                  itempartno: warehousetransferses[fwt].itempartno,
                  prodwarehouseorigin:
                    warehousetransferses[fwt].prodwarehouseorigin,
                  prodwarehousetransfer:
                    warehousetransferses[fwt].prodwarehousetransfer,
                  quantitytrans: warehousetransferses[fwt].quantitytrans,
                  itemprimaryimg: warehousetransferses[fwt].itemprimaryimg
                };

                // Add to transferitmlist array
                warehousetransfer.warehousetransproducts[0].transferitmlist.unshift(
                  translist
                );
              }

              warehousetransfer
                .save()
                .then(warehousetransfer => {
                  console.log("finalllly warehouse history saved successfully");
                  delete req.session.warehousetransfer;
                  res.json(warehousetransfer);
                })
                .catch(err => {
                  console.log("err is : " + err);
                });
            });
          });
      })
      .catch(err => {
        console.error(err);
        res.json(errors);
      });
  }
);

// @route   GET api/warehousetransfer/warehousetransferhistoryall
// @desc    Get warehousetransferhistoryall
// @access  Private

/////// WAREHOUSE TRANSFER HISTORY API/////
router.get(
  "/warehousetransferhistoryall",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    errors.message = "There Is No Warehouse Transfer found";
    errors.className = "alert-danger";

    Warehousetransfer.find()
      .then(warehousetransfer => {
        // res.json(warehousetransfer);

        var warehousetransferlen = warehousetransfer.length;
        console.log(
          "The Length of warehousetransfer is : " + warehousetransferlen
        );

        var warehousetransferarr = [];

        for (var i = 0; i < warehousetransferlen; i++) {
          if (warehousetransferarr == "") {
            var createddate = warehousetransfer[i].date;

            const arrayobjdata = {
              date: createddate.toDateString()
            };
            // Add to newstockhistoryarr array
            warehousetransferarr.unshift(arrayobjdata);

            console.log("The Created Date is : " + createddate.toDateString());
          }
        }

        console.log("first entry insert!!");

        var warehousetransferarrlen = Object.keys(warehousetransferarr).length;

        console.log(
          "The Length of warehousetransferarr is : " + warehousetransferarrlen
        );

        for (var i = 0; i < warehousetransferlen; i++) {
          for (var j = 0; j < warehousetransferarrlen; j++) {
            if (
              warehousetransfer[i].date.toDateString() !=
              warehousetransferarr[j].date
            ) {
              var createddate = warehousetransfer[i].date;

              const arrayobjdata = {
                date: createddate.toDateString()
              };
              // Add to warehousetransferarr array
              warehousetransferarr.unshift(arrayobjdata);

              console.log(
                "The Created Date is : " + createddate.toDateString()
              );
            }
          }
        }

        res.json(warehousetransferarr); //here we get the unique date from the Warehousetransfer collection data
        //eg: Wed Mar 06 2019,Thu Mar 07 2019 etc
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

router.get(
  "/warehousetransferhistorybydate/:date",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    errors.message = "There Is No Warehouse Transfer found";
    errors.className = "alert-danger";

    var createddate = req.params.date;
    console.log(
      "find all product stock that created on date is : " + createddate
    );

    Warehousetransfer.find()
      .then(warehousetransfer => {
        //res.json(warehousetransfer);
        var warehousetransferlen = warehousetransfer.length;
        console.log(
          "The Length of warehousetransfer is : " + warehousetransferlen
        );

        var stockhistorybydate = [];

        for (var i = 0; i < warehousetransferlen; i++) {
          if (warehousetransfer[i].date.toDateString() == createddate) {
            for (
              var j = 0;
              j < warehousetransfer[i].warehousetransproducts.length;
              j++
            ) {
              // Add to stockhistorybydate array
              stockhistorybydate.unshift(
                warehousetransfer[i].warehousetransproducts[j]
              );
            }
          }
        }
        res.json(stockhistorybydate); //here we get the  product stock acc to requested created date
        //eg: Wed Mar 06 2019,Thu Mar 07 2019 etc
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

router.get(
  "/singlewarehousetranshistory/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Warehousetransfer.findOne({ _id: req.params.id })
      .then(warehousetransfer => {
        if (!warehousetransfer) {
          errors.nowarehousetransfer = "There are no warehousetransfer";
          return res.status(404).json(errors);
        }

        res.json(warehousetransfer);
      })
      .catch(err =>
        res
          .status(404)
          .json({ warehousetransfer: "There are no warehousetransfer" })
      );
  }
);

//////////////////////////
//Exports
module.exports = router;
