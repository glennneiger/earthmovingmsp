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

router.get(
  "/addnewwarehousetransfer/:prodstk_id&:prodwarehouseorigin&:prodwarehousetransfer&:quantitytrans", //here we can pass multiple middlewares like for upload and authentication
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    // if (prostk_id) console.log(prostk_id);

    var prodstk_id = req.params.prodstk_id;
    var prodwarehouseorigin = req.params.prodwarehouseorigin;
    var prodwarehousetransfer = req.params.prodwarehousetransfer;
    var quantitytrans = req.params.quantitytrans;

    var itemcode;

    var availabletotalqty = 0;

    var itemprimaryimg;

    const errors = {};
    errors.message = "The Product Stock Cannot Transfer";
    errors.className = "alert-danger";

    Stock.findOne({ _id: prodstk_id }).then(stock => {
      itemprimaryimg = stock.itemprimaryimg;
    });

    Warehouse.findOne({ warehouseaddress: prodwarehouseorigin })
      .then(warehouse => {
        if (warehouse) {
          for (var i = 0; i < warehouse.warehouseproducts.length; i++) {
            if (warehouse.warehouseproducts[i]._id == prodstk_id) {
              var warehousename = warehouse.warehousename;
              var warehouseaddress = warehouse.warehouseaddress;
              var itemcode = warehouse.warehouseproducts[i].itemcode;
              var totalqty = warehouse.warehouseproducts[i].quantity;

              itemcode = itemcode;
              console.log(
                "DATA FOUND ACC TO Prodstk_id : " +
                  warehouse.warehouseproducts[i]._id +
                  " WHERE TOTAL Qty OF iTEM IS : " +
                  warehouse.warehouseproducts[i].quantity
              );
              console.log(
                "Item Code : " + warehouse.warehouseproducts[i].itemcode
              );
              availabletotalqty = totalqty;

              if (
                parseInt(totalqty) <= 0 ||
                parseInt(totalqty) < parseInt(quantitytrans)
              ) {
                console.log(
                  "you cannot transfer product stock from " +
                    warehouseaddress +
                    " " +
                    "Because There are " +
                    totalqty +
                    " Quantity " +
                    "of" +
                    itemcode
                );
                errors.message =
                  "you cannot transfer product stock from " +
                  warehouseaddress +
                  " " +
                  "Because There are " +
                  totalqty +
                  " Quantity " +
                  "of " +
                  itemcode;
                errors.className = "alert-danger";
                res.status(400).json(errors);
              } else {
                var warehousename = warehouse.warehousename;
                var warehouseaddress = warehouse.warehouseaddress;
                var itemcode = warehouse.warehouseproducts[i].itemcode;
                var totalqty = warehouse.warehouseproducts[i].quantity;

                var companynamedata = {};
                companynamedata.companyname = "XYZ COMPANY";

                var newconfigentry = true;

                const warehousetransferproducts = {
                  user: req.user.id,
                  prodstk_id: prodstk_id,
                  itemcode: itemcode,
                  prodwarehouseorigin: prodwarehouseorigin,
                  prodwarehousetransfer: prodwarehousetransfer,
                  quantitytrans: quantitytrans,
                  itemprimaryimg: itemprimaryimg
                };

                console.log(
                  "you can transfer product stock from " +
                    warehouseaddress +
                    " " +
                    " There are " +
                    totalqty +
                    " Quantity " +
                    "of" +
                    itemcode
                );
                console.log("///////// ORIGIN UPDATE START ///////////////");

                var updatedtotalqty = totalqty - parseInt(quantitytrans);

                warehouse.warehouseproducts[i].quantity = updatedtotalqty; //HERE WE UPDATE TOTALQTY OF Item
                console.log(
                  "final updated value of totalqty deduction is =>> " +
                    updatedtotalqty
                );

                warehouse
                  .save()
                  .then(warehouse => {
                    console.log(
                      "Final Single warehouse deduction operation done in ORIGIN WAREHOUSE"
                    );
                    console.log(
                      "///////// TRANSFER Update START ///////////////"
                    );

                    Warehouse.findOne({
                      $and: [{ warehouseaddress: prodwarehousetransfer }]
                    }).then(warehouse => {
                      for (
                        var i = 0;
                        i < warehouse.warehouseproducts.length;
                        i++
                      ) {
                        if (warehouse.warehouseproducts[i]._id == prodstk_id) {
                          console.log(
                            "Already Exist in transfer warehouse item with Quantity"
                          );
                          var warehousename = warehouse.warehousename;
                          var warehouseaddress = warehouse.warehouseaddress;
                          var itemcode =
                            warehouse.warehouseproducts[i].itemcode;
                          var totalqty =
                            warehouse.warehouseproducts[i].quantity;

                          var updatedtotalqty =
                            totalqty + parseInt(quantitytrans);

                          warehouse.warehouseproducts[
                            i
                          ].quantity = updatedtotalqty; //HERE WE UPDATE TOTALQTY OF Item
                          console.log(
                            "final updated value of totalqty addition is =>> " +
                              updatedtotalqty
                          );
                          warehouse
                            .save()
                            .then(warehouse => {
                              console.log(
                                "Final Single warehouse ADDITION operation done in TRANSFER WAREHOUSE: "
                              );
                              console.log(
                                "after update addition" + warehouseaddress
                              );

                              new Warehousetransfer(companynamedata)
                                .save()
                                .then(warehousetransfer => {
                                  console.log(
                                    "history warehouse transfer save!!"
                                  );

                                  // Add to warehousetransferproducts array
                                  warehousetransfer.warehousetransproducts.unshift(
                                    warehousetransferproducts
                                  );
                                  warehousetransfer
                                    .save()
                                    .then(warehousetransfer => {
                                      //delete req.session.warehousetransfer;
                                      console.log(
                                        "warehouse transfer stock is : " +
                                          warehousetransfer
                                      );
                                      res.json(warehousetransfer);

                                      //res.json(req.session.warehousetransfer);
                                      console.log(
                                        "log after response send to the server"
                                      );
                                    })
                                    .catch(err =>
                                      res.status(404).json({
                                        errors:
                                          "warehousetransfer is not save !!"
                                      })
                                    );
                                });
                            })
                            .catch(err => {
                              console.log("Error is : " + err);
                            });
                          newconfigentry = false;
                          break;
                        }
                      }

                      console.log(
                        "newconfigentry value is : " + newconfigentry
                      );

                      if (newconfigentry) {
                        console.log(
                          "Ready to Insert New AddNewStock with Quantity"
                        );

                        //if in transfer warehouse no prodstk_id exist acc to prodstk_id so we will insert addnewstock with it quantity

                        Stock.findOne({ _id: prodstk_id }).then(stock => {
                          const warehouseprodfields = {
                            user: req.user.id,
                            _id: stock._id,
                            itemcode: stock.itemcode,
                            quantity: quantitytrans
                          };

                          Warehouse.findOne({
                            warehouseaddress: prodwarehousetransfer
                          }).then(warehouse => {
                            warehouse.warehouseproducts.unshift(
                              warehouseprodfields
                            );

                            warehouse.save().then(warehouse => {
                              console.log(
                                "AddNewStock is insert with Quantity successfully!!"
                              );
                              console.log(warehouse);
                              new Warehousetransfer(companynamedata)
                                .save()
                                .then(warehousetransfer => {
                                  // Add to warehousetransferproducts array
                                  warehousetransfer.warehousetransproducts.unshift(
                                    warehousetransferproducts
                                  );
                                  warehousetransfer
                                    .save()
                                    .then(warehousetransfer => {
                                      console.log(
                                        "history warehouse transfer save!!"
                                      );
                                      //delete req.session.warehousetransfer;
                                      console.log(
                                        "warehouse transfer stock is : " +
                                          warehousetransfer
                                      );
                                      res.json(warehousetransfer);

                                      //res.json(req.session.warehousetransfer);
                                      console.log(
                                        "log after response send to the server"
                                      );
                                    })
                                    .catch(err =>
                                      res.status(404).json({
                                        errors:
                                          "warehousetransfer is not save !!"
                                      })
                                    );
                                });
                            });
                          });
                        });
                      }
                    });
                  })
                  .catch(err => {
                    console.log("Error is : " + err);
                  });
              }
            }
          }
        }
      })
      .catch(err =>
        res.status(404).json({ warehouse: "There are no warehouses" })
      );
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
      .then(warehosuetransfer => {
        // res.json(warehosuetransfer);

        var warehosuetransferlen = warehosuetransfer.length;
        console.log(
          "The Length of warehosuetransfer is : " + warehosuetransferlen
        );

        var warehosuetransferarr = [];

        for (var i = 0; i < warehosuetransferlen; i++) {
          if (warehosuetransferarr == "") {
            var createddate = warehosuetransfer[i].date;

            const arrayobjdata = {
              date: createddate.toDateString()
            };
            // Add to newstockhistoryarr array
            warehosuetransferarr.unshift(arrayobjdata);

            console.log("The Created Date is : " + createddate.toDateString());
          }
        }

        console.log("first entry insert!!");

        var warehosuetransferarrlen = Object.keys(warehosuetransferarr).length;

        console.log(
          "The Length of warehosuetransferarr is : " + warehosuetransferarrlen
        );

        for (var i = 0; i < warehosuetransferlen; i++) {
          for (var j = 0; j < warehosuetransferarrlen; j++) {
            if (
              warehosuetransfer[i].date.toDateString() !=
              warehosuetransferarr[j].date
            ) {
              var createddate = warehosuetransfer[i].date;

              const arrayobjdata = {
                date: createddate.toDateString()
              };
              // Add to warehosuetransferarr array
              warehosuetransferarr.unshift(arrayobjdata);

              console.log(
                "The Created Date is : " + createddate.toDateString()
              );
            }
          }
        }

        res.json(warehosuetransferarr); //here we get the unique date from the Warehousetransfer collection data
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
      .then(warehosuetransfer => {
        //res.json(warehosuetransfer);
        var warehosuetransferlen = warehosuetransfer.length;
        console.log(
          "The Length of warehosuetransfer is : " + warehosuetransferlen
        );

        var stockhistorybydate = [];

        for (var i = 0; i < warehosuetransferlen; i++) {
          if (warehosuetransfer[i].date.toDateString() == createddate) {
            for (
              var j = 0;
              j < warehosuetransfer[i].warehousetransproducts.length;
              j++
            ) {
              // Add to stockhistorybydate array
              stockhistorybydate.unshift(
                warehosuetransfer[i].warehousetransproducts[j]
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

//////////////////////////
//Exports
module.exports = router;
