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

const storage = multer.diskStorage({
  destination: function(req, files, cb) {
    cb(null, "client/public/uploads/productstockimg");
  },
  filename: function(req, files, cb) {
    cb(null, Date.now() + files.originalname);
  }
});

const fileFilter = (req, files, cb) => {
  // reject a file
  if (
    files.mimetype === "image/jpeg" ||
    files.mimetype === "image/jpg" ||
    files.mimetype === "image/png" ||
    files.mimetype === "image/gif"
  ) {
    cb(null, true); //save the file
  } else {
    cb(null, false); //not save file
  }
};

//const upload = multer({ dest: "client/public/uploads/productstockimg" });

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

const productcategoryorig = require("../../config/ExportData");

// Load Validation
const validateAddnewStockInput = require("../../validation/addnewstock");

// Load Stock Model
const stock = require("../../models/Stock");
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
        console.log("You Have No Authority To Access This API");
      } else {
        /*console.log(authData.role + " " + "Has Authority To Access This API");*/

        if (authData.role == authorizedrole.superadminrodleid) {
          //[HERE WE CHECK ONLY AUTHORIZE USER CAN ACCESS THIS API]

          const errors = {};

          Stock.find()
            .then(stocks => {
              if (stocks) {
                //we found the stock
                res.json(stocks); //here we get all the stocks and send as response
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

// @route   POST api/stock/addnewstock
// @desc    Add addnewstock to stock
// @access  Private
router.post(
  "/addnewstock", //here we can pass multiple middlewares like for upload and authentication
  passport.authenticate("jwt", { session: false }),
  //upload.single("productImage"),
  upload.any(),
  (req, res, next) => {
    //  console.log(req.file);
    // console.log("filename is" + " " + req.file.filename);

    const { errors, isValid } = validateAddnewStockInput(req.body);

    //console.log(req.file);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    // Get fields
    const stockFields = {};
    stockFields.user = req.user.id;
    if (req.body.itemname) stockFields.itemname = req.body.itemname;
    if (req.body.itemcode) stockFields.itemcode = req.body.itemcode;

    if (req.body.itemlength) stockFields.itemlength = req.body.itemlength;
    if (req.body.itemwidth) stockFields.itemwidth = req.body.itemwidth;
    if (req.body.itemheight) stockFields.itemheight = req.body.itemheight;
    if (req.body.hsncode) stockFields.hsncode = req.body.hsncode;
    if (req.body.itemwarehouse)
      stockFields.itemwarehouse = req.body.itemwarehouse;
    if (req.body.rack) stockFields.rack = req.body.rack;
    if (req.body.quantity) stockFields.quantity = req.body.quantity;
    if (req.body.minrate) stockFields.minrate = req.body.minrate;
    if (req.body.rate) stockFields.rate = req.body.rate;
    if (req.body.maxrate) stockFields.maxrate = req.body.maxrate;

    if (req.body.machinepart) stockFields.machinepart = req.body.machinepart;

    if (req.body.forcompany) stockFields.forcompany = req.body.forcompany;

    if (req.body.acceptedFiles)
      stockFields.acceptedFiles = req.body.acceptedFiles;

    var machinepartobj = JSON.parse(stockFields.machinepart);

    console.log(
      "machinepartobj  value is : " +
        machinepartobj +
        " " +
        "and its length is : " +
        machinepartobj.length
    );
    var forcompanyobj = JSON.parse(stockFields.forcompany);
    console.log(
      "forcompanyobj  value is : " +
        forcompanyobj +
        " " +
        "and its length is : " +
        forcompanyobj.length
    );

    console.log("quantity is : " + stockFields.quantity);

    /*let productImage = [];
    if (req.files) {
      for (let i = 0; i < req.files.length; i += 1) {
        productImage.push("/uploads/productstockimg/" + req.files[i].filename);
      }
    }
    console.log("urls are : " + productImage);
*/
    /*

 for (let i = 0; i < req.files.length; i += 1) {
      console.log(`File ${req.files[i].originalname} uploaded to ${req.files[i].path}`);
    }
    */

    /*

 upload(req,res,function(err) {
        //console.log(req.body);
        //console.log(req.files);
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
    */

    /*  for (let [key, value] of Object.entries(machinepart)) {
      console.log("Basic item Info is : " + key, value);
    }
    for (let [key, value] of Object.entries(forcompany)) {
      console.log("Basic item Info is : " + key, value);
    }
*/
    //With ES6, if you need both keys and values simultaneously, do
    /*for (let [key, value] of Object.entries(stockFields)) {
      console.log("Basic item Info is : " + key, value);
    }*/

    Stock.findOne({
      //here we first check article is exist in stock collection if its exist so it will throw error
      $and: [{ itemcode: stockFields.itemcode }]
    })
      .then(stock => {
        const errors = {};
        errors.message = "Something Went Wrong, STOCK NOT CREATE!!";
        errors.className = "alert-danger";

        if (stock) {
          //if its found user requested itemcode then it will throw error in res
          errors.message =
            "Itemcode" +
            " " +
            stockFields.itemcode +
            "already in the Stock !! You cannot add it again !!";
          errors.className = "alert-danger";
          res.status(400).json(errors);
        } else {
          //if requested user itemcode not found it means the stock admin wants to add its totally fresh or new
          // Save the New Stock of the product

          let productimgurls = [];
          if (req.files) {
            for (let i = 0; i < req.files.length; i += 1) {
              productimgurls.push(
                "/uploads/productstockimg/" + req.files[i].filename
              );
            }
          }
          const stockcollectionData = {
            user: req.user.id,
            itemname: stockFields.itemname,
            itemcode: stockFields.itemcode,
            machinepart: JSON.stringify(machinepartobj),
            itemlength: stockFields.itemlength,
            itemwidth: stockFields.itemwidth,
            itemheight: stockFields.itemheight,
            forcompany: JSON.stringify(forcompanyobj),
            hsncode: stockFields.hsncode,
            itemwarehouse: stockFields.itemwarehouse,
            rack: stockFields.rack,
            quantity: stockFields.quantity,
            minrate: stockFields.minrate,
            rate: stockFields.rate,
            maxrate: stockFields.maxrate,
            productImage: productimgurls
          };

          new Stock(stockcollectionData).save().then(stock => {
            console.log("stock is saved in stock collection");
            var prodstk_id = stock._id;
            console.log("product stock id of added itemcode is :" + prodstk_id);

            Warehouse.findOne({
              $and: [{ itemcode: stockFields.itemcode }]
            }).then(warehouse => {
              if (warehouse) {
                //if its found user requested itemncode then it will throw error in res
                errors.message =
                  "ItemCode" +
                  " " +
                  stockFields.itemcode +
                  "already in the Warehouse !! You cannot add it again !!";
                errors.className = "alert-danger";
                res.status(400).json(errors);
              } else {
                //here we insert all itemncode details to the requested warehouse address
                Warehouse.findOne({
                  warehouseaddress: stockFields.itemwarehouse
                }).then(warehouse => {
                  var warehousecapacity = warehouse.warehousecapacity;
                  var warehouseaddress = warehouse.warehouseaddress;

                  console.log(
                    "Your ctn capacity of " +
                      warehouseaddress +
                      " is " +
                      warehousecapacity
                  );
                  console.log(
                    "here we unshift the current itemncode info with quantity in requested warehouse"
                  );

                  const warehouseprodfields = {
                    user: req.user.id,
                    _id: prodstk_id,
                    itemname: stockFields.itemname,
                    itemcode: stockFields.itemcode,
                    machinepart: JSON.stringify(machinepartobj),
                    itemlength: stockFields.itemlength,
                    itemwidth: stockFields.itemwidth,
                    itemheight: stockFields.itemheight,
                    forcompany: JSON.stringify(forcompanyobj),
                    hsncode: stockFields.hsncode,
                    rack: stockFields.rack,
                    quantity: stockFields.quantity,
                    minrate: stockFields.minrate,
                    rate: stockFields.rate,
                    maxrate: stockFields.maxrate,
                    productImage: productimgurls
                  };

                  // Add to warehouseproducts array
                  warehouse.warehouseproducts.unshift(warehouseprodfields);

                  warehouse
                    .save()
                    .then(warehouse => {
                      console.log(warehouse);

                      /*
                      console.log(warehouse);

                      //here we save the productsizeconfigs acc to requested prodwarehouse
                      console.log(
                        "saved the productsizeconfigs acc to requested prodwarehouse"
                      );
                      /////HERE WE SAVE ARTICLE INFO WITH PRODSIZECONFIG IN OTHER WAREHOUSE FOR MAINTAINING THE RECORD WITH TOTAL CTN 0////////
                      Warehouse.find().then(warehouse => {
                        //here we also insert the requested article info to the other warehouse for maintaining the record of totalctn of each article
                        //console.log(warehouse);

                        var warehouselength = warehouse.length;
                        console.log("warehouse length is :" + warehouselength);

                        for (var i = 0; i < warehouselength; i++) {
                          if (
                            warehouse[i].warehouseaddress !=
                            stockFields.itemwarehouse
                          ) {
                            const warehouseprodfields = {
                              user: req.user.id,
                              _id: prodstk_id,
                              itemname: stockFields.itemname,
                              itemcode: stockFields.itemcode,
                              machinepart: JSON.stringify(machinepartobj),
                              itemlength: stockFields.itemlength,
                              itemwidth: stockFields.itemwidth,
                              itemheight: stockFields.itemheight,
                              forcompany: JSON.stringify(forcompanyobj),
                              hsncode: stockFields.hsncode,
                              quantity: 0,
                              minrate: stockFields.minrate,
                              rate: stockFields.rate,
                              maxrate: stockFields.maxrate,
                              productImage: productimgurls
                            };

                            console.log(
                              "WORKING ON => " + warehouse[i].warehouseaddress
                            );

                            // Add to warehouseproducts array
                            warehouse[i].warehouseproducts.unshift(
                              warehouseprodfields
                            );
                            warehouse[i].save().then(warehouse => {
                              console.log(
                                "current dissimilar warehouse.warehouseproducts.length is : " +
                                  warehouse.warehouseproducts.length
                              );
                            });
                          } else {
                            console.log(
                              "finding dissimilar warehouse address in warehouse collection!!"
                            );
                          }
                        }
                      });
                      */
                    })
                    .catch(err => console.log("Error is : " + err));
                });
              }
            });

            res.json(stock);
          });
        }
      })
      .catch(err => res.status(404).json({ errors }));
  }
);
module.exports = router;
