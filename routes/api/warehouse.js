const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const authorizedrole = require("../../config/authorizeroles");

const passport = require("passport");

const { ensureAuthenticated, verifyToken } = require("../../config/auth"); //this middleware check only login user can access routes

const multer = require("multer");
const path = require("path");

const productcategoryorig = require("../../config/ExportData");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "client/public/uploads/warehouseimage");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true); //save the file
  } else {
    cb(null, false); //not save file
    console.log("file is not saved");
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 //it allow only 5 mb file
  },
  fileFilter: fileFilter
});

// Load Validation
const validateAddnewWarehouseInput = require("../../validation/addnewarehouse");

// Load User Model
const User = require("../../models/User");

// Load Stock Model
const Stock = require("../../models/Stock");

// Load Warehouse Model
const Warehouse = require("../../models/Warehouse");

// @route   GET api/stock/test
// @desc    Tests Stock route
// @access  Public

//this api route created for testing purpose only authenticate and autherize person can access this API
router.get("/test", verifyToken, (req, res) => {
  jwt.verify(req.token, keys.secretOrKey, (err, authData) => {
    //jwt.verify check user has authenticate token or not that he was get after successfully login and if he has authenticate token then he pass this middleware [HERE WE CHECK AUTHENTICATION]
    if (err) {
      res.sendStatus(403);
    } else {
      // console.log(authData.role + " " + "Has Authority To Access This API");

      if (authData.role == authorizedrole.superadminrodleid) {
        //[HERE WE CHECK ONLY AUTHORIZE USER CAN ACCESS THIS API]
        res.json({ msg: "Stock Works", authData }); //here for testing purpose we just return in terms of response loggedin user data you can do whatever you want to do with authenticate and authorize api
      } else {
        {
          /*} console.log(
          authData.role + " " + "have no Authority To Access This API"
       );*/
        }

        res.sendStatus(403); //if user is authenticate successful but user is not authorize person so response will send forbidden//no access of this API
      }
    }
  });
});

// @route   GET api/stock/all
// @desc    Get all stocks
// @access  Private

//well this is also act middleware for checking the authenticate person => passport.authenticate("jwt", { session: false }) ==> [IN SIMPLE TERM IT CHECK ONLY LOGIN USER CAN ACCESS THIS API {HERE IS NO AUTHORIZATION}]
router.get(
  "/all",
  // passport.authenticate("jwt", { session: false }),
  verifyToken,
  (req, res) => {
    jwt.verify(req.token, keys.secretOrKey, (err, authData) => {
      //jwt.verify check user has authenticate token or not that he was get after successfully login and if he has authenticate token then he pass this middleware [HERE WE CHECK AUTHENTICATION]
      if (err) {
        res.sendStatus(403);
      } else {
        // console.log(authData.role + " " + "Has Authority To Access This API");

        if (authData.role == authorizedrole.superadminrodleid) {
          //[HERE WE CHECK ONLY AUTHORIZE USER CAN ACCESS THIS API]

          const errors = {};

          Warehouse.find()
            .then(warehouses => {
              if (warehouses) {
                //we found the warehouse
                res.json(warehouses); //here we get all the warehouses and send as response
              } else {
                errors.message = "There are no warehouses";
                errors.className = "alert-danger";
                return res.status(404).json(errors);
              }
            })
            .catch(err =>
              res.status(404).json({ warehouse: "There are no warehouses" })
            );
        } else {
          {
            /*} console.log(
            authData.role + " " + "have no Authority To Access This API"
         );*/
          }

          res.sendStatus(403); //if user is authenticate successful but user is not authorize person so response will send forbidden//no access of this API
        }
      }
    });
  }
);

router.get(
  "/singlewarehousebyid/:id",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    var prodstk_id = req.params.id;

    console.log("requested article id is : " + prodstk_id);

    errors.message = "There Is No article info found in Warehouse";
    errors.className = "alert-danger";

    Warehouse.findOne({ _id: prodstk_id })
      .then(warehouse => {
        res.json(warehouse);
      })
      .catch(err => res.status(404).json({ err }));
  }
);

// @route   POST api/stock/addnewstock
// @desc    Add addnewstock to stock
// @access  Private
router.post(
  "/addnewwarehouse", //here we can pass multiple middlewares like for upload and authentication
  passport.authenticate("jwt", { session: false }),
  upload.single("warehouseImage"),
  (req, res, next) => {
    //console.log(req.file);
    //console.log("filename is" + " " + req.file.filename);

    const { errors, isValid } = validateAddnewWarehouseInput(req.body);

    //console.log(req.file);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    // Get fields
    const stockFields = {};
    stockFields.user = req.user.id;
    console.log(stockFields.user);

    if (req.body.warehousename)
      stockFields.warehousename = req.body.warehousename;

    if (req.body.warehouseaddress)
      stockFields.warehouseaddress = req.body.warehouseaddress;

    if (req.body.warehousepincode)
      stockFields.warehousepincode = req.body.warehousepincode;

    if (req.body.warehousecity)
      stockFields.warehousecity = req.body.warehousecity;

    if (req.body.warehousecapacity)
      stockFields.warehousecapacity = req.body.warehousecapacity;

    if (req.body.warehouseImage) {
      if (req.file.path) {
        console.log("file path is set");
        stockFields.warehouseImage =
          "/uploads/warehouseimage/" + req.file.filename;
      }
    } else {
      console.log("file path is not set");
      stockFields.warehouseImage = "/uploads/warehouseimage/warehouse.jpg";
    }

    errors.message = "Something Went Wrong, WAREHOUSE NOT CREATE!!";
    errors.className = "alert-danger";
    Warehouse.findOne({
      warehouseaddress: stockFields.warehouseaddress
    })
      .then(warehouse => {
        if (warehouse) {
          //if its found requested warehouseaddress then it will throw error in res
          errors.message =
            "Warehouse of this Address : " +
            stockFields.warehouseaddress +
            " " +
            " already in the Warehouse !! You cannot add it again !!";
          errors.className = "alert-danger";
          res.status(400).json(errors);
        } else {
          //if requested user article not found it means the stock admin wants to add its totally fresh or new
          // Save the New Stock of the product
          new Warehouse(stockFields)
            .save()
            .then(warehouse => res.json(warehouse));
        }
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

// @route   DELETE api/warehouse
// @desc    Delete warehouse by thier id
// @access  Private
router.delete(
  "/singlewarehouseremove/:warehouse_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    errors.message = "The Warehouse Id is not found";
    errors.className = "alert-danger";

    Warehouse.findOne({ _id: req.params.warehouse_id })
      .then(warehouse => {
        if (warehouse) {
          Warehouse.findByIdAndRemove({ _id: req.params.warehouse_id }).then(
            () => {
              res.json({ success: "Warehouse is deleted successfully" });
            }
          );
        }
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

// @route   Post api/stock
// @desc    Edit product stock by their id
// @access  Private
router.put(
  `/updatesinglewarehouse/:paramid`,
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    // Get fields
    const errors = {};

    errors.message = "The Warehouse Id is not found";
    errors.className = "alert-danger";

    Warehouse.findOne({ _id: req.params.paramid })
      .then(warehouse => {
        if (warehouse) {
          // Update
          Warehouse.findByIdAndUpdate(req.params.paramid, req.body, function(
            //req.body => stockdata that we send from its action from [editStock]
            err,
            warehouse
          ) {
            if (err) return next(err);
            res.json(warehouse);
          });
        }
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

router.get(
  "/singlewarehousealliteminfo/:id",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    var prodstk_id = req.params.id;

    //console.log("requested article id is : " + prodstk_id);

    errors.message = "There Is No article info found in Warehouse";
    errors.className = "alert-danger";

    Stock.findOne({ _id: prodstk_id })
      .then(stock => {
        //res.json(stock);
        // console.log(stock);

        var itemcodereq = stock.itemcode;

        Warehouse.find()
          .then(warehouses => {
            if (warehouses) {
              for (var i = 0; i < warehouses.length; i++) {
                for (
                  var j = 0;
                  j < warehouses[i].warehouseproducts.length;
                  j++
                ) {
                  /* console.log(
                        "Here we calculate all pair acc to prodstk_id where totalctn should be greater then 0 in productsizeconfigs"
                      );*/

                  if (
                    warehouses[i].warehouseproducts[j]._id == prodstk_id &&
                    warehouses[i].warehouseproducts[j].quantity > 0
                  ) {
                    console.log(
                      "From Warehouse Address : " +
                        warehouses[i].warehouseaddress
                    );
                    console.log(
                      "Warehouse warehouseproducts prodstk_id: " +
                        warehouses[i].warehouseproducts[j]._id
                    );

                    console.log(
                      "Warehouse -> warehouseproducts -> quantity : " +
                        warehouses[i].warehouseproducts[j].quantity
                    );

                    warehsbyitemallres.quantity +=
                      warehouses[i].warehouseproducts[j].quantity;
                  }
                }
              }

              res.json(warehsbyitemallres);
            }
          })
          .catch(err =>
            res.status(404).json({ warehouse: "There are no warehouses" })
          );
      })
      .catch(err => res.status(404).json({ err }));
  }
);

router.get(
  "/singlewarehouseiteminfo/:id",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    var prodstk_id = req.params.id;

    //console.log("requested article id is : " + prodstk_id);

    errors.message = "There Is No article info found in Warehouse";
    errors.className = "alert-danger";

    Stock.findOne({ _id: prodstk_id })
      .then(stock => {
        //res.json(stock);
        // console.log(stock);

        var itemcodereq = stock.itemcode;

        // console.log(itemcodereq);
        // $and: [{ prodcolor: prodcolor }, { itemcode: itemcode }]

        Warehouse.find()
          .then(warehouses => {
            if (warehouses) {
              //console.log(warehouses);
              //res.json(warehouses);

              var warehsbyitemfinalresl = [];

              var warehouseslength = warehouses.length;

              for (var i = 0; i < warehouseslength; i++) {
                for (
                  var j = 0;
                  j < warehouses[i].warehouseproducts.length;
                  j++
                ) {
                  if (warehouses[i].warehouseproducts[j]._id == prodstk_id) {
                    const whpbyreqiteminfo = {
                      _id: warehouses[i]._id,
                      warehouseaddress: warehouses[i].warehouseaddress,
                      prodstk_id: warehouses[i].warehouseproducts[j]._id,
                      quantity: warehouses[i].warehouseproducts[j].quantity,
                      itemcode: warehouses[i].warehouseproducts[j].itemcode
                    };

                    // Add to warehouseproducts array
                    warehsbyitemfinalresl.unshift(whpbyreqiteminfo);
                  }
                }
              }
              // console.log("loop work done!!");

              res.json(warehsbyitemfinalresl);
            } else {
              errors.message = "There are no warehouses";
              errors.className = "alert-danger";
              return res.status(404).json(errors);
            }
          })
          .catch(err =>
            res.status(404).json({ warehouse: "There are no warehouses" })
          );
      })
      .catch(err => res.status(404).json({ err }));
  }
);

router.get(
  "/originprodstockall/:prodwarehouseorigin",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    errors.message = "The Warehouse Origin is not found";
    errors.className = "alert-danger";

    Warehouse.findOne({ warehouseaddress: req.params.prodwarehouseorigin })
      .then(warehouse => {
        // console.log("Requested Warehouse Address : " + warehouse);
        var finalwarehouseproducts = [];
        var sizesarr = [];
        //res.json({ warehouse });

        var warehousename = warehouse.warehousename;
        var warehouseaddress = warehouse.warehouseaddress;

        //   console.log("The Origin Warehouse Name is : " + warehousename);

        //  console.log("The Origin Warehouse Address is : " + warehouseaddress);

        {
          /* console.log(
          "The length of the warehouseproducts is : " + warehouseproductslen
        );
       */
        }

        async function checksome2() {
          for (var i = 0; i < warehouse.warehouseproducts.length; i++) {
            if (warehouse.warehouseproducts[i].quantity > 0) {
              let availableqty = warehouse.warehouseproducts[i].quantity;

              let promise = new Promise((resolve, reject) => {
                setTimeout(
                  () =>
                    resolve(
                      Stock.findOne({
                        _id: warehouse.warehouseproducts[i]._id
                      }).then(stock => {
                        console.log("////found stock///");

                        const wareproducts = {
                          _id: stock._id,
                          itemcode: stock.itemcode,
                          quantity: availableqty,
                          itemname: stock.itemname,
                          machinepart: stock.machinepart,
                          itemlength: stock.itemlength,
                          itemwidth: stock.itemwidth,
                          itemheight: stock.itemheight,
                          forcompany: stock.forcompany,
                          hsncode: stock.hsncode,
                          minrate: stock.minrate,
                          rate: stock.rate,
                          maxrate: stock.maxrate,
                          itemprimaryimg: stock.itemprimaryimg
                        };
                        // console.log(wareproducts);
                        finalwarehouseproducts.unshift(wareproducts);
                      })
                    ),
                  100
                );
              });

              let result = await promise; // wait till the promise resolves (*)

              if (result) {
                console.log("after update deduction" + prodwarehousetransfer); // "done!"
              }
            } else {
              console.log("Finding ALL STOCK Acc To Condition");
            }
          }
        }

        checksome2().then(() => res.json({ finalwarehouseproducts }));
      })
      .catch(err => res.status(404).json({ err }));
  }
);
/////////////
router.get(
  "/viewalladvsearchstock",
  // passport.authenticate("jwt", { session: false }),
  verifyToken,
  (req, res) => {
    jwt.verify(req.token, keys.secretOrKey, (err, authData) => {
      //jwt.verify check user has authenticate token or not that he was get after successfully login and if he has authenticate token then he pass this middleware [HERE WE CHECK AUTHENTICATION]
      if (err) {
        res.sendStatus(403);
        console.log("You Have No Authority To Access This API");
      } else {
        let querystr = "mcpartname1";
        /*console.log(authData.role + " " + "Has Authority To Access This API");*/

        if (authData.role == authorizedrole.superadminrodleid) {
          //[HERE WE CHECK ONLY AUTHORIZE USER CAN ACCESS THIS API]

          const errors = {};
          Stock.find()
            .then(stocks => {
              if (stocks) {
                let finalallstock = [];
                const stockslen = stocks.length;
                //   console.log("Stock Length is  : " + stockslen);

                for (var i = 0; i < stockslen; i++) {
                  if (
                    querystr == stocks[i].itemcode ||
                    querystr == stocks[i].itemname ||
                    querystr == stocks[i].itemlength ||
                    querystr == stocks[i].itemheight ||
                    querystr == stocks[i].itemwidth ||
                    querystr == stocks[i].hsncode ||
                    stocks[i].machinepart.includes(querystr) ||
                    stocks[i].forcompany.includes(querystr)
                  ) {
                    const singleitemdata = {
                      _id: stocks[i]._id,
                      itemname: stocks[i].itemname,
                      itemcode: stocks[i].itemcode,
                      machinepart: JSON.parse(stocks[i].machinepart),
                      itemlength: stocks[i].itemlength,
                      itemwidth: stocks[i].itemwidth,
                      itemheight: stocks[i].itemheight,
                      forcompany: JSON.parse(stocks[i].forcompany),
                      hsncode: stocks[i].hsncode,
                      //    rack: stocks[i].rack,
                      minrate: stocks[i].minrate,
                      rate: stocks[i].rate,
                      maxrate: stocks[i].maxrate,
                      itemprimaryimg: stocks[i].itemprimaryimg
                    };

                    // Add to finalallstock array
                    finalallstock.unshift(singleitemdata);
                    console.log("//////some data////");
                    console.log(finalallstock);

                    // console.log(JSON.parse(stocks[i].machinepart))
                    //  console.log(stocks[i].machinepart.includes(querystr));
                  }
                }
                res.json({ finalallstock });
              } else {
                errors.message = "There are no stocks";
                errors.className = "alert-danger";
                return res.status(404).json(errors);
              }
            })
            .catch(err =>
              res.status(404).json({ stock: "There are no stocks" })
            );
        } else {
          {
            /*} console.log(
              authData.role + " " + "have no Authority To Access This API"
           );*/
          }

          res.sendStatus(403); //if user is authenticate successful but user is not authorize person so response will send forbidden//no access of this API
        }
      }
    });
  }
);

////////////
module.exports = router;
