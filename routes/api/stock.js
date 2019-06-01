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

// Load NewStockHistory Model
const NewStockHistory = require("../../models/NewStockHistory");
// Load ExistingStockHistory Model
const ExistingStockHistory = require("../../models/ExistingStockHistory");
// Load AddonExisStkHis Model
const Addonexisstkhis = require("../../models/Addonexisstkhis");

// Load Removeonexisstkhis Model
const Removeonexisstkhis = require("../../models/Removeonexisstkhis");

// Load Editedstkhis Model
const Editedstkhis = require("../../models/Editedstkhis");

// Load DeletedStockHistory Model
const DeletedStockHistory = require("../../models/DeletedStockHistory");

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

router.get(
  "/viewallstock",
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
                let finalallstock = [];
                const stockslen = stocks.length;
                //   console.log("Stock Length is  : " + stockslen);

                Warehouse.find().then(warehouse => {
                  const warehouselen = warehouse.length;
                  //  console.log("Warehouse Length is  : " + stockslen);
                  for (var i = 0; i < stockslen; i++) {
                    var calquantity = 0;

                    /*  console.log(
                      "////working on itempartno" + stocks[i].itempartno + "////"
                    );*/

                    for (var j = 0; j < warehouselen; j++) {
                      for (
                        var k = 0;
                        k < warehouse[j].warehouseproducts.length;
                        k++
                      ) {
                        if (
                          warehouse[j].warehouseproducts[k].itempartno ==
                          stocks[i].itempartno
                        ) {
                          /*  console.log(
                            "The length of current warehouseproducts Is : " +
                              warehouse[j].warehouseproducts.length
                          );

                          console.log(
                            "////Working on " +
                              warehouse[j].warehouseaddress +
                              " ////"
                          );
                          console.log(
                            "itempartno is " +
                              warehouse[j].warehouseproducts[k].itempartno +
                              "found where quantity is : " +
                              warehouse[j].warehouseproducts[k].quantity
                          );*/

                          calquantity += parseInt(
                            warehouse[j].warehouseproducts[k].quantity
                          );
                        }
                      }
                    }

                    const singleitemdata = {
                      _id: stocks[i]._id,
                      itemtechname: stocks[i].itemtechname,
                      itempartno: stocks[i].itempartno,
                      machinenames: JSON.parse(stocks[i].machinenames),
                      itemid: stocks[i].itemid,
                      itemidunit: stocks[i].itemidunit,
                      itemod: stocks[i].itemod,
                      itemodunit: stocks[i].itemodunit,
                      itemlength: stocks[i].itemlength,
                      itemlengthunit: stocks[i].itemlengthunit,
                      itemthickness: stocks[i].itemthickness,
                      itemthicknessunit: stocks[i].itemthicknessunit,
                      hsncode: stocks[i].hsncode,
                      //    rack: stocks[i].rack,
                      minrate: stocks[i].minrate,
                      rate: stocks[i].rate,
                      maxrate: stocks[i].maxrate,
                      itemremark: stocks[i].itemremark,
                      quantity: calquantity,
                      itemprimaryimg: stocks[i].itemprimaryimg
                    };

                    // Add to finalallstock array
                    finalallstock.unshift(singleitemdata);
                    var calquantity = 0; //set calquantity =0 for the next item
                  }
                  // console.log("loop operation done");

                  res.json(finalallstock);
                  // console.log("final response send");
                });
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
    if (req.body.itemtechname) stockFields.itemtechname = req.body.itemtechname;
    if (req.body.itempartno) stockFields.itempartno = req.body.itempartno;

    if (req.body.itemlength) stockFields.itemlength = req.body.itemlength;

    if (req.body.itemid) stockFields.itemid = req.body.itemid;
    if (req.body.itemidunit) stockFields.itemidunit = req.body.itemidunit;

    if (req.body.itemod) stockFields.itemod = req.body.itemod;
    if (req.body.itemodunit) stockFields.itemodunit = req.body.itemodunit;

    if (req.body.itemlength) stockFields.itemlength = req.body.itemlength;
    if (req.body.itemlengthunit)
      stockFields.itemlengthunit = req.body.itemlengthunit;

    if (req.body.itemthickness)
      stockFields.itemthickness = req.body.itemthickness;
    if (req.body.itemthicknessunit)
      stockFields.itemthicknessunit = req.body.itemthicknessunit;

    if (req.body.hsncode) stockFields.hsncode = req.body.hsncode;
    if (req.body.itemwarehouse)
      stockFields.itemwarehouse = req.body.itemwarehouse;
    //if (req.body.rack) stockFields.rack = req.body.rack;
    if (req.body.quantity) stockFields.quantity = req.body.quantity;
    if (req.body.minrate) stockFields.minrate = req.body.minrate;
    if (req.body.rate) stockFields.rate = req.body.rate;
    if (req.body.maxrate) stockFields.maxrate = req.body.maxrate;

    if (req.body.itemremark) stockFields.itemremark = req.body.itemremark;

    if (req.body.machinenames) stockFields.machinenames = req.body.machinenames;

    if (req.body.minqtyreqfornotify)
      stockFields.minqtyreqfornotify = req.body.minqtyreqfornotify;
    if (req.body.acceptedFiles)
      stockFields.acceptedFiles = req.body.acceptedFiles;

    var machinenamesobj = JSON.parse(stockFields.machinenames);

    console.log(
      "machinenamesobj  value is : " +
        machinenamesobj +
        " " +
        "and its length is : " +
        machinenamesobj.length
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

    /*  for (let [key, value] of Object.entries(machinenames)) {
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
      $and: [{ itempartno: stockFields.itempartno }]
    })
      .then(stock => {
        const errors = {};
        errors.message = "Something Went Wrong, STOCK NOT CREATE!!";
        errors.className = "alert-danger";

        if (stock) {
          //if its found user requested itempartno then it will throw error in res
          errors.message =
            "Item Part No" +
            " " +
            stockFields.itempartno +
            "already in the Stock !! You cannot add it again !!";
          errors.className = "alert-danger";
          res.status(400).json(errors);
        } else {
          //if requested user itempartno not found it means the stock admin wants to add its totally fresh or new
          // Save the New Stock of the product

          let productimgurls = [];
          if (req.files) {
            for (let i = 0; i < req.files.length; i += 1) {
              productimgurls.push(
                "/uploads/productstockimg/" + req.files[i].filename
              );
            }
          }
          let itemprimaryimgurl =
            "/uploads/productstockimg/" + req.files[0].filename;

          const stockcollectionData = {
            user: req.user.id,
            itemtechname: stockFields.itemtechname,
            itempartno: stockFields.itempartno,
            machinenames: JSON.stringify(machinenamesobj),
            itemid: stockFields.itemid,
            itemidunit: stockFields.itemidunit,
            itemod: stockFields.itemod,
            itemodunit: stockFields.itemodunit,
            itemlength: stockFields.itemlength,
            itemlengthunit: stockFields.itemlengthunit,
            itemthickness: stockFields.itemthickness,
            itemthicknessunit: stockFields.itemthicknessunit,
            hsncode: stockFields.hsncode,
            itemwarehouse: stockFields.itemwarehouse,
            minrate: stockFields.minrate,
            rate: stockFields.rate,
            maxrate: stockFields.maxrate,
            itemremark: stockFields.itemremark,
            itemprimaryimg: itemprimaryimgurl,
            productImage: productimgurls
          };

          new Stock(stockcollectionData).save().then(stock => {
            console.log("stock is saved in stock collection");
            const newstockhistoryData = {
              user: req.user.id,
              itemtechname: stockFields.itemtechname,
              itempartno: stockFields.itempartno,
              machinenames: JSON.stringify(machinenamesobj),
              itemid: stockFields.itemid,
              itemidunit: stockFields.itemidunit,
              itemod: stockFields.itemod,
              itemodunit: stockFields.itemodunit,
              itemlength: stockFields.itemlength,
              itemlengthunit: stockFields.itemlengthunit,
              itemthickness: stockFields.itemthickness,
              itemthicknessunit: stockFields.itemthicknessunit,
              hsncode: stockFields.hsncode,
              itemwarehouse: stockFields.itemwarehouse,
              minrate: stockFields.minrate,
              rate: stockFields.rate,
              maxrate: stockFields.maxrate,
              itemremark: stockFields.itemremark,
              itemprimaryimg: itemprimaryimgurl,
              productImage: productimgurls,
              quantity: stockFields.quantity,
              prodwarehouse: stockFields.itemwarehouse
            };
            //here we first save the history of newly stock add in collection NewStockHistory
            new NewStockHistory(newstockhistoryData)
              .save()
              .then(newstockhistory => {
                console.log("NewStockHistory is saved");
              });

            var prodstk_id = stock._id;
            console.log(
              "product stock id of added itempartno is :" + prodstk_id
            );

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
                itempartno: stockFields.itempartno,
                quantity: stockFields.quantity,
                minqtyreqfornotify: stockFields.minqtyreqfornotify
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
                itempartno: stockFields.itempartno,
                quantity: stockFields.quantity
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

            res.json(stock);
          });
        }
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

// @route   GET api/stock/singleprodstock/:_id
// @desc    Get stock by ID
// @access  Private

router.get(
  "/singleprodstock/:id",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    var prodstk_id = req.params.id;

    errors.message = "There Is No Product Stock found";
    errors.className = "alert-danger";

    Stock.findOne({ _id: prodstk_id })
      .then(stock => {
        //let finalstockbyid;
        const singleitemdata = {
          _id: stock._id,
          itemtechname: stock.itemtechname,
          itempartno: stock.itempartno,
          machinenames: Object.values(JSON.parse(stock.machinenames)),
          itemid: stock.itemid,
          itemidunit: stock.itemidunit,
          itemod: stock.itemod,
          itemodunit: stock.itemodunit,
          itemlength: stock.itemlength,
          itemlengthunit: stock.itemlengthunit,
          itemthickness: stock.itemthickness,
          itemthicknessunit: stock.itemthicknessunit,
          hsncode: stock.hsncode,
          minrate: stock.minrate,
          rate: stock.rate,
          maxrate: stock.maxrate,
          itemremark: stock.itemremark,
          itemprimaryimg: stock.itemprimaryimg,
          productImage: stock.productImage
        };

        //finalstockbyid.push(singleitemdata);
        console.log(singleitemdata);
        res.json(singleitemdata);
        //res.json(stock);
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

// @route   Post api/stock
// @desc    Edit product stock by their id
// @access  Private
router.put(
  `/updatesingleprodstock/:paramid`,
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    // Get fields
    const errors = {};

    const eitemtechname = req.body.itemtechname;
    const eitemid = req.body.itemid;
    const eitemidunit = req.body.itemidunit;
    const eitemod = req.body.itemod;
    const eitemodunit = req.body.itemodunit;
    const eitemlength = req.body.itemlength;
    const eitemlengthunit = req.body.itemlengthunit;
    const eitemthickness = req.body.itemthickness;
    const eitemthicknessunit = req.body.itemthicknessunit;
    const emachinenames = req.body.machinenames;
    const ehsncode = req.body.hsncode;
    const eminrate = req.body.minrate;
    const erate = req.body.rate;
    const emaxrate = req.body.maxrate;
    const eitemremark = req.body.itemremark;

    console.log(
      "edit stock new value received : " + eitemtechname,
      eitemid,
      eitemidunit,
      eitemod,
      eitemodunit,
      eitemlength,
      eitemlengthunit,
      eitemthickness,
      eitemthicknessunit,
      emachinenames,
      ehsncode,
      eminrate,
      erate,
      emaxrate,
      eitemremark
    );

    errors.message = "The Product Id is not found";
    errors.className = "alert-danger";

    const iseditstockobjfill = true;

    Stock.findOne({ _id: req.params.paramid })
      .then(stock => {
        if (stock) {
          var previtemtechname = stock.itemtechname;

          var previtemid = stock.itemid;
          var previtemidunit = stock.itemidunit;
          var previtemod = stock.itemod;
          var previtemodunit = stock.itemodunit;

          var previtemlength = stock.itemlength;
          var previtemlengthunit = stock.itemlengthunit;
          var previtemthickness = stock.itemthickness;
          var previtemthicknessunit = stock.itemthicknessunit;

          var prevmachinenames = stock.machinenames;
          var prevhsncode = stock.hsncode;
          var prevminrate = stock.minrate;
          var prevrate = stock.rate;
          var prevmaxrate = stock.maxrate;

          var previtemremark = stock.itemremark;
          if (
            previtemtechname == eitemtechname &&
            previtemid == eitemid &&
            prevmachinenames == emachinenames &&
            previtemidunit == eitemidunit &&
            previtemod == eitemod &&
            previtemodunit == eitemodunit &&
            previtemlength == eitemlength &&
            previtemlengthunit == eitemlengthunit &&
            previtemthickness == eitemthickness &&
            previtemthicknessunit == eitemthicknessunit &&
            prevhsncode == ehsncode &&
            prevminrate == eminrate &&
            prevrate == erate &&
            prevmaxrate == emaxrate &&
            previtemremark == eitemremark
          ) {
            /* Object.assign(existingstkdata, {
              noeditstock: "stock is not edited"
            });*/
            console.log(
              "All the edit stock field are same as prev in stock collection!!"
            );
            res.json(stock);
          } else {
            // Promise
            const CheckifConditions = new Promise(async (resolve, reject) => {
              if (iseditstockobjfill) {
                console.log(
                  "START : edit stock field are not same as prev in stock collection!!"
                );
                const existingstkdata = {
                  prodstk_id: stock._id,
                  itempartno: stock.itempartno,
                  operation: "editonexistingprodstock",
                  itemprimaryimg: stock.itemprimaryimg,
                  eitemidwithunit: [],
                  eitemodwithunit: [],
                  eitemlenwithunit: [],
                  eitemthicwithunit: []
                };

                if (previtemtechname != eitemtechname) {
                  await Object.assign(existingstkdata, {
                    eitemtechname: eitemtechname
                  });
                  console.log("eitemtechname edited : " + eitemtechname);
                }
                if (previtemid != eitemid || previtemidunit != eitemidunit) {
                  //   Object.assign(existingstkdata, { eitemid: eitemid });
                  await existingstkdata.eitemidwithunit.push(eitemid);
                  await existingstkdata.eitemidwithunit.push(eitemidunit);

                  console.log(
                    "eitemidwithunit edited : " + eitemid + eitemidunit
                  );
                }

                if (previtemod != eitemod || previtemodunit != eitemodunit) {
                  //   Object.assign(existingstkdata, { eitemid: eitemid });
                  await existingstkdata.eitemodwithunit.push(eitemod);
                  await existingstkdata.eitemodwithunit.push(eitemodunit);

                  console.log(
                    "eitemodwithunit edited : " + eitemod + eitemodunit
                  );
                }

                if (
                  previtemlength != eitemlength ||
                  previtemlengthunit != eitemlengthunit
                ) {
                  //   Object.assign(existingstkdata, { eitemid: eitemid });
                  await existingstkdata.eitemlenwithunit.push(eitemlength);
                  await existingstkdata.eitemlenwithunit.push(eitemlengthunit);

                  console.log(
                    "eitemlenwithunit edited : " + eitemlength + eitemlengthunit
                  );
                }
                if (
                  previtemthickness != eitemthickness ||
                  previtemthicknessunit != eitemthicknessunit
                ) {
                  //   Object.assign(existingstkdata, { eitemid: eitemid });
                  await existingstkdata.eitemthicwithunit.push(eitemthickness);
                  await existingstkdata.eitemthicwithunit.push(
                    eitemthicknessunit
                  );

                  console.log(
                    "eitemthicwithunit edited : " +
                      eitemthickness +
                      eitemthicknessunit
                  );
                }

                if (prevrate != erate) {
                  await Object.assign(existingstkdata, { erate: erate });
                  console.log("erate edited : " + erate);
                }
                if (prevmachinenames != emachinenames) {
                  await Object.assign(existingstkdata, {
                    emachinenames: emachinenames
                  });
                  console.log("emachinenames edited : " + emachinenames);
                }

                /*   if (prevmachinenames != emachinenames) {
                  Object.assign(existingstkdata, {
                    emachinenames: emachinenames
                  });
                  console.log("emachinenames edited : " + emachinenames);
                }

                if (prevhsncode != ehsncode) {
                  Object.assign(existingstkdata, { ehsncode: ehsncode });
                  console.log("ehsncode edited : " + ehsncode);
                }
                if (prevminrate != eminrate) {
                  Object.assign(existingstkdata, { eminrate: eminrate });
                  console.log("eminrate edited : " + eminrate);
                }
              
                if (prevmaxrate != emaxrate) {
                  Object.assign(existingstkdata, { emaxrate: emaxrate });
                  console.log("emaxrate edited : " + emaxrate);
                }
                if (previtemremark != eitemremark) {
                  Object.assign(existingstkdata, { eitemremark: eitemremark });
                  console.log("eitemremark edited : " + eitemremark);
                }*/
                console.log("END : all the above if condition checked");
                return resolve(existingstkdata);
              } else {
                var reason = new Error("Your Existingstkdata IS NOT FILL");
                return reject(reason);
              }
            });
            // call our promise
            const Donow = () => {
              CheckifConditions.then(existingstkdata => {
                // Great!,existingstkdata obj has data received in promise
                // console.log(existingstkdata);
                // Update
                Stock.findByIdAndUpdate(req.params.paramid, req.body, function(
                  //req.body => stockdata that we send from its action from [editStock]
                  err,
                  stock
                ) {
                  if (err) {
                    return next(err);
                  }

                  //Then We save the history of edited stock in collection Editedstkhis
                  new Editedstkhis(existingstkdata)
                    .save()
                    .then(existingstockhistory => {
                      console.log(existingstkdata);
                      res.json(existingstockhistory);
                      console.log("ADD Editedstkhis is saved");
                    })
                    .catch(err => res.status(404).json({ err }));

                  //  console.log(existingstkdata);
                  // res.json(stock);
                });
              }).catch(error => {
                // ops, you're friend is not ready :o
                console.log(error.message);
              });
            };
            Donow();
          }
        }
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

// @route   DELETE api/stock
// @desc    Delete product stock by thier id
// @access  Private
router.delete(
  "/singleprodremove/:prodstock_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    var prodstk_id = req.params.prodstock_id;
    errors.message = "The Product Id is not found";
    errors.className = "alert-danger";

    Stock.findOne({ _id: prodstk_id })
      .then(stock => {
        const deletedstkdata = {
          prodstk_id: stock._id,
          itempartno: stock.itempartno,
          itemtechname: stock.itemtechname,
          itemid: stock.itemid,
          itemidunit: stock.itemidunit,
          itemod: stock.itemod,
          itemodunit: stock.itemodunit,
          itemlength: stock.itemlength,
          itemlengthunit: stock.itemlengthunit,
          itemthickness: stock.itemthickness,
          itemthicknessunit: stock.itemthicknessunit,
          machinenames: stock.machinenames,
          forcompany: stock.forcompany,
          hsncode: stock.hsncode,
          minrate: stock.minrate,
          rate: stock.rate,
          maxrate: stock.maxrate,
          operation: "deletedprodstock",
          itemprimaryimg: stock.itemprimaryimg,
          warehousewithquantity: []
        };

        if (stock) {
          Stock.findByIdAndRemove({ _id: prodstk_id }).then(stock => {
            console.log("product is removed from stock!!");

            Warehouse.find()
              .then(async warehouses => {
                if (warehouses) {
                  //we found the warehouses
                  //  res.json(warehouses);

                  console.log("Here First We Remove Stock");

                  var warehouseslength = warehouses.length;

                  console.log("Loop Operation Start");

                  for (i = 0; i < warehouseslength; i++) {
                    for (
                      var j = 0;
                      j < warehouses[i].warehouseproducts.length;
                      j++
                    ) {
                      if (
                        warehouses[i].warehouseproducts[j]._id == prodstk_id
                      ) {
                        // If you want to remove element at position x, use:
                        //someArray.splice(x, 1);
                        //array.splice(index, howmany, item1, ....., itemX)

                        console.log(
                          "Run For id found of : " +
                            warehouses[i].warehouseproducts[j].itempartno +
                            " in warehouse address => " +
                            warehouses[i].warehouseaddress +
                            "AT INDEX OF warehouseproducts ARRAY =>" +
                            j
                        );
                        const warehousewithqty = {
                          prodwarehouse: warehouses[i].warehouseaddress,
                          quantity: warehouses[i].warehouseproducts[j].quantity
                        };
                        if (warehouses[i].warehouseproducts.splice(j, 1)) {
                          console.log(
                            "Product Stock Remove Acc to Requested product stock id"
                          );

                          await deletedstkdata.warehousewithquantity.unshift(
                            warehousewithqty
                          );

                          warehouses[i]
                            .save()
                            .then(res => {
                              // res.json({ success: "Product is deleted successfully" });
                              console.log("save success");
                            })
                            .catch(err =>
                              res.status(404).json({
                                warehouse: "not save fail"
                              })
                            );
                        } else {
                          console.log("Not Remove");
                        }
                      }
                    }
                  }

                  console.log("Loop Operation Complete");

                  console.log("////Time To Save Deleted Stock History/////");
                  //Then We save the history of deleted stock
                  new DeletedStockHistory(deletedstkdata)
                    .save()
                    .then(deletedstkdata => {
                      console.log(deletedstkdata);

                      console.log("DeletedStockHistory is saved");
                      res.json(deletedstkdata);
                    });
                } else {
                  errors.message =
                    "There are no product stock id found in the warehouses";
                  errors.className = "alert-danger";
                  return res.status(404).json(errors);
                }
              })
              .catch(err =>
                res.status(404).json({
                  warehouse:
                    "There are no product stock id found in the warehouses"
                })
              );
          });
        }
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

//ADD ON EXISTING PRODUCT STOCK

router.post(
  "/addonexistingprodstock", //here we can pass multiple middlewares like for upload and authentication
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    const prodstk_id = req.body.prodstk_id;
    const itempartno = req.body.itempartno;
    const prodwarehouse = req.body.prodwarehouse;
    const prodorigin = req.body.prodorigin;
    const reqquantity = req.body.quantity;
    const itemprimaryimg = req.body.itemprimaryimg;
    console.log("////work on addonexisting stock////");

    console.log(
      "Received data is : " + prodstk_id,
      itempartno,
      prodwarehouse,
      prodorigin,
      reqquantity,
      itemprimaryimg
    );

    var newitmentrywithqty = true;

    Warehouse.find().then(warehouse => {
      //console.log(warehouse);
      //res.json(warehouse);

      var warehouselength = warehouse.length;
      for (var i = 0; i < warehouselength; i++) {
        for (var j = 0; j < warehouse[i].warehouseproducts.length; j++) {
          if (
            warehouse[i].warehouseaddress == prodwarehouse &&
            warehouse[i].warehouseproducts[j]._id == prodstk_id
          ) {
            const existingstkdata = {
              prodstk_id: warehouse[i].warehouseproducts[j]._id,
              itempartno: warehouse[i].warehouseproducts[j].itempartno,
              prodwarehouse: prodwarehouse,
              prodorigin: prodorigin,
              quantity: reqquantity,
              operation: "addonexistingprodstock",
              itemprimaryimg: itemprimaryimg
            };

            console.log(
              "Updating Warehouse Address: " + warehouse[i].warehouseaddress
            );

            console.log(
              "item stock id is:" + warehouse[i].warehouseproducts[j]._id
            );

            console.log(
              "Total quantity found acc to requested prodstk_id is : " +
                warehouse[i].warehouseproducts[j].quantity
            );

            var finalupdatedqty = (warehouse[i].warehouseproducts[
              j
            ].quantity += parseInt(reqquantity));

            console.log("Requested Quantity is by user : " + reqquantity);

            console.log(
              "FINAL Updated Total Quantity OF REQUESTED prodstk_id IS : " +
                finalupdatedqty
            );
            //res.status(400).json(errors);

            warehouse[i]
              .save()
              .then(warehouse => {
                //console.log("updated existing config totalctn"+warehouse)
                //res.json(warehouse)

                //here we first save the history of existing stock in collection Addonexisstkhis
                new Addonexisstkhis(existingstkdata)
                  .save()
                  .then(existingstockhistory => {
                    res.json(existingstockhistory);
                    console.log("ADD Addonexisstkhis is saved");
                  });
              })
              .catch(err =>
                console.log("updated existing prodstk_id error is : " + err)
              );
            newitmentrywithqty = false;
            break;
          } else {
            console.log("founding the same prodstk_id as user requested");
          }
        }
      }

      console.log(
        "The Status of newitmentrywithqty is : " + newitmentrywithqty
      );

      if (newitmentrywithqty) {
        console.log(
          "Ready to Insert New Item Entry with Quantity in warehouse is : " +
            prodwarehouse
        );

        //here we insert all itemncode details to the requested warehouse address
        Warehouse.findOne({
          warehouseaddress: prodwarehouse
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

          const existingstkdata = {
            prodstk_id: prodstk_id,
            itempartno: itempartno,
            prodwarehouse: prodwarehouse,
            prodorigin: prodorigin,
            quantity: reqquantity,
            operation: "addonexistingprodstock",
            itemprimaryimg: itemprimaryimg
          };

          console.log("req.user.id is : " + req.user.id);
          const warehouseprodfields = {
            user: req.user.id,
            _id: prodstk_id,
            itempartno: itempartno,
            quantity: reqquantity
          };

          // Add to warehouseproducts array
          warehouse.warehouseproducts.unshift(warehouseprodfields);

          warehouse
            .save()
            .then(warehouse => {
              console.log(warehouse);

              console.log("New Entry Of Add New Stock Inserted");

              //here we first save the history of existing stock in collection Addonexisstkhis
              new Addonexisstkhis(existingstkdata)
                .save()
                .then(existingstockhistory => {
                  res.json(existingstockhistory);
                  console.log("ADD Addonexisstkhis is saved");
                });
            })
            .catch(err => console.log("Error is : " + err));
        });
      }
    });
  }
);

//REMOVE ON EXISTING PRODUCT STOCK
router.post(
  "/removeonexistingprodstock", //here we can pass multiple middlewares like for upload and authentication
  passport.authenticate("jwt", { session: false }),
  function(req, res) {
    const errors = {};
    errors.message = "There Is No Warehouse Found";
    errors.className = "alert-danger";

    const warehouseid = req.body.warehouseid;
    const warehouseaddress = req.body.warehouseaddress;
    const prodstk_id = req.body.prodstk_id;
    const itempartno = req.body.itempartno;
    const reqremoveqty = req.body.removeqty;
    const itemprimaryimg = req.body.itemprimaryimg;

    console.log("////work on removeonexisting stock////");

    console.log(
      "Received data is : " + warehouseid,
      itempartno,
      warehouseaddress,
      prodstk_id,
      reqremoveqty,
      itemprimaryimg
    );

    Warehouse.findOne({
      $and: [{ _id: warehouseid }, { warehouseaddress: warehouseaddress }]
    })
      .then(warehouse => {
        for (var i = 0; i < warehouse.warehouseproducts.length; i++) {
          if (warehouse.warehouseproducts[i]._id == prodstk_id) {
            console.log(
              "Updating Item Warehouse Address: " + warehouse.warehouseaddress
            );
            console.log(
              "item id is:" +
                warehouse.warehouseproducts[i]._id +
                " where " +
                "=> totalqty is : " +
                warehouse.warehouseproducts[i].quantity
            );
            var origintotalqty = warehouse.warehouseproducts[i].quantity;

            if (parseInt(reqremoveqty) > parseInt(origintotalqty)) {
              errors.message =
                "You Cannot Remove : " +
                parseInt(reqremoveqty) +
                " Quantity of Item Part No : " +
                warehouse.warehouseproducts[i].itempartno +
                " Becasue There are available Quantity is : " +
                origintotalqty;
              errors.className = "alert-danger";

              console.log(
                "You Cannot Remove : " +
                  parseInt(reqremoveqty) +
                  " Quantity of Item Part No : " +
                  warehouse.warehouseproducts[i].itempartno +
                  " Becasue There are available Quantity is : " +
                  origintotalqty
              );

              res.status(400).json(errors);
              console.log(
                "exit from if statement after check reqremoveqty should be less then available origintotalqty acc to warehouse address of corresponding to requested item"
              );
              //loopexit
              break;
            } else {
              console.log(
                "run if requested qty is less then available qty acc to warehouse address and its id of corresponding to requested item"
              );

              console.log("type of quantity is : " + typeof origintotalqty);

              console.log(
                "original quantity is : " +
                  warehouse.warehouseproducts[i].quantity
              );

              console.log(
                "requesting remove quantity is : " + parseInt(reqremoveqty)
              );

              var updatedtotalqty = origintotalqty - parseInt(reqremoveqty);

              warehouse.warehouseproducts[i].quantity = updatedtotalqty; //HERE WE UPDATE TOTALQTY OF Item IF IT CAME BACK IN ITERATION SO IT HAS UPDATED TOTALQty
              console.log(
                "final updated value of total quantity after remove is =>> " +
                  updatedtotalqty
              );

              const existingstkdata = {
                prodstk_id: prodstk_id,
                itempartno: itempartno,
                prodwarehouse: warehouseaddress,
                quantity: reqremoveqty,
                operation: "removeonexistingprodstock",
                itemprimaryimg: itemprimaryimg
              };

              warehouse
                .save()
                .then(warehouse => {
                  console.log("The Quantity is Successfully Remove!!");
                  //Remove  Quantity from existing prod stock
                  new Removeonexisstkhis(existingstkdata)
                    .save()
                    .then(existingstockhistory => {
                      console.log("Remove Removeonexisstkhis is saved");

                      res.json(existingstockhistory);
                    });
                })
                .catch(err => {
                  console.log("Error is : " + err);
                });

              break;
            }
          }
        }
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

//////////NEW STOCK HISTORY API

router.get(
  "/newstockhistoryall",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    errors.message = "There Is No Product Stock found";
    errors.className = "alert-danger";

    NewStockHistory.find()
      .then(newstockhistory => {
        // res.json(newstockhistory);

        var newstockhistorylen = newstockhistory.length;
        console.log("The Length of newstockhistory is : " + newstockhistorylen);

        var newstockhistoryarr = [];

        for (var i = 0; i < newstockhistorylen; i++) {
          if (newstockhistoryarr == "") {
            var createddate = newstockhistory[i].date;

            const arrayobjdata = {
              date: createddate.toDateString()
            };
            // Add to newstockhistoryarr array
            newstockhistoryarr.unshift(arrayobjdata);

            console.log("The Created Date is : " + createddate.toDateString());
          }
        }

        console.log("first entry insert!!");

        var newstockhistoryarrlen = Object.keys(newstockhistoryarr).length;

        console.log(
          "The Length of newstockhistoryarr is : " + newstockhistoryarrlen
        );

        for (var i = 0; i < newstockhistorylen; i++) {
          for (var j = 0; j < newstockhistoryarrlen; j++) {
            if (
              newstockhistory[i].date.toDateString() !=
              newstockhistoryarr[j].date
            ) {
              var createddate = newstockhistory[i].date;

              const arrayobjdata = {
                date: createddate.toDateString()
              };
              // Add to newstockhistoryarr array
              newstockhistoryarr.unshift(arrayobjdata);

              console.log(
                "The Created Date is : " + createddate.toDateString()
              );
            }
          }
        }

        res.json(newstockhistoryarr); //here we get the unique date from the NewStockHistory collection data
        //eg: Wed Mar 06 2019,Thu Mar 07 2019 etc
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

router.get(
  "/newstockhistorybydate/:date",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    errors.message = "There Is No Product Stock found";
    errors.className = "alert-danger";

    var createddate = req.params.date;
    console.log(
      "find all product stock that created on date is : " + createddate
    );

    NewStockHistory.find()
      .then(newstockhistory => {
        //res.json(newstockhistory);
        var newstockhistorylen = newstockhistory.length;
        console.log("The Length of newstockhistory is : " + newstockhistorylen);

        var stockhistorybydate = [];

        for (var i = 0; i < newstockhistorylen; i++) {
          if (newstockhistory[i].date.toDateString() == createddate) {
            // Add to stockhistorybydate array
            stockhistorybydate.unshift(newstockhistory[i]);
          }
        }
        res.json(stockhistorybydate); //here we get the  product stock acc to requested created date
        //eg: Wed Mar 06 2019,Thu Mar 07 2019 etc
      })
      .catch(err => res.status(404).json({ errors }));
  }
);
/////////////

/////EXISTING STOCK HISTORY API///////

router.get(
  "/existingstockhistoryall",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    errors.message = "There Is No Product Stock found";
    errors.className = "alert-danger";

    ExistingStockHistory.find()
      .then(existingstockhistory => {
        // res.json(existingstockhistory);

        var existingstockhistorylen = existingstockhistory.length;
        console.log(
          "The Length of existingstockhistory is : " + existingstockhistorylen
        );

        var existingstockhistoryarr = [];

        for (var i = 0; i < existingstockhistorylen; i++) {
          if (existingstockhistoryarr == "") {
            var createddate = existingstockhistory[i].date;

            const arrayobjdata = {
              date: createddate.toDateString()
            };
            // Add to newstockhistoryarr array
            existingstockhistoryarr.unshift(arrayobjdata);

            console.log("The Created Date is : " + createddate.toDateString());
          }
        }

        console.log("first entry insert!!");

        var existingstockhistoryarrlen = Object.keys(existingstockhistoryarr)
          .length;

        console.log(
          "The Length of existingstockhistoryarr is : " +
            existingstockhistoryarrlen
        );

        for (var i = 0; i < existingstockhistorylen; i++) {
          for (var j = 0; j < existingstockhistoryarrlen; j++) {
            if (
              existingstockhistory[i].date.toDateString() !=
              existingstockhistoryarr[j].date
            ) {
              var createddate = existingstockhistory[i].date;

              const arrayobjdata = {
                date: createddate.toDateString()
              };
              // Add to existingstockhistoryarr array
              existingstockhistoryarr.unshift(arrayobjdata);

              console.log(
                "The Created Date is : " + createddate.toDateString()
              );
            }
          }
        }

        res.json(existingstockhistoryarr); //here we get the unique date from the ExistingStockHistory collection data
        //eg: Wed Mar 06 2019,Thu Mar 07 2019 etc
      })
      .catch(err => res.status(404).json({ errors }));
  }
);
/////////////////////////////
router.get(
  "/existaddstockhisalldates",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    errors.message = "There Is No Product Stock found";
    errors.className = "alert-danger";

    Addonexisstkhis.find()
      .then(existingstockhistory => {
        // res.json(existingstockhistory);

        var existingstockhistorylen = existingstockhistory.length;
        console.log(
          "The Length of existingstockhistory is : " + existingstockhistorylen
        );

        var existingstockhistoryarr = [];

        for (var i = 0; i < existingstockhistorylen; i++) {
          if (existingstockhistoryarr == "") {
            var createddate = existingstockhistory[i].date;

            const arrayobjdata = {
              date: createddate.toDateString()
            };
            // Add to newstockhistoryarr array
            existingstockhistoryarr.unshift(arrayobjdata);

            console.log("The Created Date is : " + createddate.toDateString());
          }
        }

        console.log("first entry insert!!");

        var existingstockhistoryarrlen = Object.keys(existingstockhistoryarr)
          .length;

        console.log(
          "The Length of existingstockhistoryarr is : " +
            existingstockhistoryarrlen
        );

        for (var i = 0; i < existingstockhistorylen; i++) {
          for (var j = 0; j < existingstockhistoryarrlen; j++) {
            if (
              existingstockhistory[i].date.toDateString() !=
              existingstockhistoryarr[j].date
            ) {
              var createddate = existingstockhistory[i].date;

              const arrayobjdata = {
                date: createddate.toDateString()
              };
              // Add to existingstockhistoryarr array
              existingstockhistoryarr.unshift(arrayobjdata);

              console.log(
                "The Created Date is : " + createddate.toDateString()
              );
            }
          }
        }

        res.json(existingstockhistoryarr); //here we get the unique date from the Addonexisstkhis collection data
        //eg: Wed Mar 06 2019,Thu Mar 07 2019 etc
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

router.get(
  "/existremovestockhisalldates",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    errors.message = "There Is No Product Stock found";
    errors.className = "alert-danger";

    Removeonexisstkhis.find()
      .then(existingstockhistory => {
        // res.json(existingstockhistory);

        var existingstockhistorylen = existingstockhistory.length;
        console.log(
          "The Length of existingstockhistory is : " + existingstockhistorylen
        );

        var existingstockhistoryarr = [];

        for (var i = 0; i < existingstockhistorylen; i++) {
          if (existingstockhistoryarr == "") {
            var createddate = existingstockhistory[i].date;

            const arrayobjdata = {
              date: createddate.toDateString()
            };
            // Add to newstockhistoryarr array
            existingstockhistoryarr.unshift(arrayobjdata);

            console.log("The Created Date is : " + createddate.toDateString());
          }
        }

        console.log("first entry insert!!");

        var existingstockhistoryarrlen = Object.keys(existingstockhistoryarr)
          .length;

        console.log(
          "The Length of existingstockhistoryarr is : " +
            existingstockhistoryarrlen
        );

        for (var i = 0; i < existingstockhistorylen; i++) {
          for (var j = 0; j < existingstockhistoryarrlen; j++) {
            if (
              existingstockhistory[i].date.toDateString() !=
              existingstockhistoryarr[j].date
            ) {
              var createddate = existingstockhistory[i].date;

              const arrayobjdata = {
                date: createddate.toDateString()
              };
              // Add to existingstockhistoryarr array
              existingstockhistoryarr.unshift(arrayobjdata);

              console.log(
                "The Created Date is : " + createddate.toDateString()
              );
            }
          }
        }

        res.json(existingstockhistoryarr); //here we get the unique date from the Removeonexisstkhis collection data
        //eg: Wed Mar 06 2019,Thu Mar 07 2019 etc
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

router.get(
  "/existeditstockhisalldates",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    errors.message = "There Is No Product Stock found";
    errors.className = "alert-danger";

    Editedstkhis.find()
      .then(existingstockhistory => {
        // res.json(existingstockhistory);

        var existingstockhistorylen = existingstockhistory.length;
        console.log(
          "The Length of existingstockhistory is : " + existingstockhistorylen
        );

        var existingstockhistoryarr = [];

        for (var i = 0; i < existingstockhistorylen; i++) {
          if (existingstockhistoryarr == "") {
            var createddate = existingstockhistory[i].date;

            const arrayobjdata = {
              date: createddate.toDateString()
            };
            // Add to newstockhistoryarr array
            existingstockhistoryarr.unshift(arrayobjdata);

            console.log("The Created Date is : " + createddate.toDateString());
          }
        }

        console.log("first entry insert!!");

        var existingstockhistoryarrlen = Object.keys(existingstockhistoryarr)
          .length;

        console.log(
          "The Length of existingstockhistoryarr is : " +
            existingstockhistoryarrlen
        );

        for (var i = 0; i < existingstockhistorylen; i++) {
          for (var j = 0; j < existingstockhistoryarrlen; j++) {
            if (
              existingstockhistory[i].date.toDateString() !=
              existingstockhistoryarr[j].date
            ) {
              var createddate = existingstockhistory[i].date;

              const arrayobjdata = {
                date: createddate.toDateString()
              };
              // Add to existingstockhistoryarr array
              existingstockhistoryarr.unshift(arrayobjdata);

              console.log(
                "The Created Date is : " + createddate.toDateString()
              );
            }
          }
        }

        res.json(existingstockhistoryarr); //here we get the unique date from the Editedstkhis collection data
        //eg: Wed Mar 06 2019,Thu Mar 07 2019 etc
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

//////////////////////////////////
router.get(
  "/existingstockhistorybydate/:date",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    errors.message = "There Is No Product Stock found";
    errors.className = "alert-danger";

    var createddate = req.params.date;
    console.log(
      "find all product stock that created on date is : " + createddate
    );

    ExistingStockHistory.find()
      .then(existingstockhistory => {
        //res.json(existingstockhistory);
        var existingstockhistorylen = existingstockhistory.length;
        console.log(
          "The Length of existingstockhistory is : " + existingstockhistorylen
        );

        var stockhistorybydate = [];

        for (var i = 0; i < existingstockhistorylen; i++) {
          if (existingstockhistory[i].date.toDateString() == createddate) {
            // Add to stockhistorybydate array
            stockhistorybydate.unshift(existingstockhistory[i]);
          }
        }
        res.json(stockhistorybydate); //here we get the  product stock acc to requested created date
        //eg: Wed Mar 06 2019,Thu Mar 07 2019 etc
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

////////////////

router.get(
  "/exisaddstkbydate/:date",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    errors.message = "There Is No Product Stock found";
    errors.className = "alert-danger";

    var createddate = req.params.date;
    console.log(
      "find all product stock that created on date is : " + createddate
    );

    Addonexisstkhis.find()
      .then(existingstockhistory => {
        //res.json(existingstockhistory);
        var existingstockhistorylen = existingstockhistory.length;
        console.log(
          "The Length of existingstockhistory is : " + existingstockhistorylen
        );

        var stockhistorybydate = [];

        for (var i = 0; i < existingstockhistorylen; i++) {
          if (existingstockhistory[i].date.toDateString() == createddate) {
            // Add to stockhistorybydate array
            stockhistorybydate.unshift(existingstockhistory[i]);
          }
        }
        res.json(stockhistorybydate); //here we get the  product stock acc to requested created date
        //eg: Wed Mar 06 2019,Thu Mar 07 2019 etc
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

router.get(
  "/exisremovestkbydate/:date",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    errors.message = "There Is No Product Stock found";
    errors.className = "alert-danger";

    var createddate = req.params.date;
    console.log(
      "find all product stock that created on date is : " + createddate
    );

    Removeonexisstkhis.find()
      .then(existingstockhistory => {
        //res.json(existingstockhistory);
        var existingstockhistorylen = existingstockhistory.length;
        console.log(
          "The Length of existingstockhistory is : " + existingstockhistorylen
        );

        var stockhistorybydate = [];

        for (var i = 0; i < existingstockhistorylen; i++) {
          if (existingstockhistory[i].date.toDateString() == createddate) {
            // Add to stockhistorybydate array
            stockhistorybydate.unshift(existingstockhistory[i]);
          }
        }
        res.json(stockhistorybydate); //here we get the  product stock acc to requested created date
        //eg: Wed Mar 06 2019,Thu Mar 07 2019 etc
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

router.get(
  "/exiseditstkbydate/:date",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    errors.message = "There Is No Product Stock found";
    errors.className = "alert-danger";

    var createddate = req.params.date;
    console.log(
      "find all product stock that created on date is : " + createddate
    );

    Editedstkhis.find()
      .then(existingstockhistory => {
        //res.json(existingstockhistory);
        var existingstockhistorylen = existingstockhistory.length;
        console.log(
          "The Length of existingstockhistory is : " + existingstockhistorylen
        );

        var stockhistorybydate = [];

        for (var i = 0; i < existingstockhistorylen; i++) {
          if (existingstockhistory[i].date.toDateString() == createddate) {
            // Add to stockhistorybydate array
            stockhistorybydate.unshift(existingstockhistory[i]);
          }
        }
        res.json(stockhistorybydate); //here we get the  product stock acc to requested created date
        //eg: Wed Mar 06 2019,Thu Mar 07 2019 etc
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

/////////////////////////

/////Deleted STOCK HISTORY API///////

router.get(
  "/deletedstockhistoryall",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    errors.message = "There Is No Deleted Product Stock found";
    errors.className = "alert-danger";

    DeletedStockHistory.find()
      .then(deletedstockhistory => {
        // res.json(deletedstockhistory);

        var deletedstockhistorylen = deletedstockhistory.length;
        console.log(
          "The Length of deletedstockhistory is : " + deletedstockhistorylen
        );

        var deletedstockhistoryarr = [];

        for (var i = 0; i < deletedstockhistorylen; i++) {
          if (deletedstockhistoryarr == "") {
            var createddate = deletedstockhistory[i].date;

            const arrayobjdata = {
              date: createddate.toDateString()
            };
            // Add to newstockhistoryarr array
            deletedstockhistoryarr.unshift(arrayobjdata);

            console.log("The Created Date is : " + createddate.toDateString());
          }
        }

        console.log("first entry insert!!");

        var deletedstockhistoryarrlen = Object.keys(deletedstockhistoryarr)
          .length;

        console.log(
          "The Length of deletedstockhistoryarr is : " +
            deletedstockhistoryarrlen
        );

        for (var i = 0; i < deletedstockhistorylen; i++) {
          for (var j = 0; j < deletedstockhistoryarrlen; j++) {
            if (
              deletedstockhistory[i].date.toDateString() !=
              deletedstockhistoryarr[j].date
            ) {
              var createddate = deletedstockhistory[i].date;

              const arrayobjdata = {
                date: createddate.toDateString()
              };
              // Add to deletedstockhistoryarr array
              deletedstockhistoryarr.unshift(arrayobjdata);

              console.log(
                "The Created Date is : " + createddate.toDateString()
              );
            }
          }
        }

        res.json(deletedstockhistoryarr); //here we get the unique date from the DeletedStockHistory collection data
        //eg: Wed Mar 06 2019,Thu Mar 07 2019 etc
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

router.get(
  "/deletedstockhistorybydate/:date",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    errors.message = "There Is No Deleted Product Stock found";
    errors.className = "alert-danger";

    var deleteddate = req.params.date;
    console.log(
      "find all product stock that deleted on date is : " + deleteddate
    );

    DeletedStockHistory.find()
      .then(deletedstockhistory => {
        //res.json(deletedstockhistory);
        var deletedstockhistorylen = deletedstockhistory.length;
        console.log(
          "The Length of deletedstockhistory is : " + deletedstockhistorylen
        );

        var stockhistorybydate = [];

        for (var i = 0; i < deletedstockhistorylen; i++) {
          if (deletedstockhistory[i].date.toDateString() == deleteddate) {
            // Add to stockhistorybydate array
            stockhistorybydate.unshift(deletedstockhistory[i]);
          }
        }
        res.json(stockhistorybydate); //here we get the  product stock acc to requested created date
        //eg: Wed Mar 06 2019,Thu Mar 07 2019 etc
      })
      .catch(err => res.status(404).json({ errors }));
  }
);
/////////////////////////

module.exports = router;
