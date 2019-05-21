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
const validateAddnewCompanyInput = require("../../validation/addnewcompany");

// Load User Model
const User = require("../../models/User");

// Load Stock Model
const Stock = require("../../models/Stock");

// Load Warehouse Model
const Warehouse = require("../../models/Warehouse");

// Load Company Model
const Company = require("../../models/Company");

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
        res.json({ msg: "Company Works", authData }); //here for testing purpose we just return in terms of response loggedin user data you can do whatever you want to do with authenticate and authorize api
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

          Company.find()
            .then(companies => {
              if (companies) {
                //we found the warehouse
                res.json(companies); //here we get all the companies and send as response
              } else {
                errors.message = "There are no companies";
                errors.className = "alert-danger";
                return res.status(404).json(errors);
              }
            })
            .catch(err =>
              res.status(404).json({ warehouse: "There are no companies" })
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

// @route   POST api/stock/addnewcompany
// @desc    Add addnewcompany to company
// @access  Private
router.post(
  "/addnewcompany", //here we can pass multiple middlewares like for upload and authentication
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    //console.log(req.file);
    //console.log("filename is" + " " + req.file.filename);

    const { errors, isValid } = validateAddnewCompanyInput(req.body);

    //console.log(req.file);

    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    // Get fields
    const stockFields = {};
    stockFields.user = req.user.id;
    //console.log(stockFields.user);

    if (req.body.companyname) stockFields.companyname = req.body.companyname;

    if (req.body.companyaddress)
      stockFields.companyaddress = req.body.companyaddress;

    if (req.body.companypincode)
      stockFields.companypincode = req.body.companypincode;

    if (req.body.companystate) stockFields.companystate = req.body.companystate;

    if (req.body.companygstno) stockFields.companygstno = req.body.companygstno;

    if (req.body.companyemail) stockFields.companyemail = req.body.companyemail;
    if (req.body.companycontactno)
      stockFields.companycontactno = req.body.companycontactno;
    if (req.body.companycontactperson)
      stockFields.companycontactperson = req.body.companycontactperson;
    if (req.body.companywebsite)
      stockFields.companywebsite = req.body.companywebsite;
    if (req.body.companypanno) stockFields.companypanno = req.body.companypanno;
    if (req.body.companybankname)
      stockFields.companybankname = req.body.companybankname;
    if (req.body.companybankaccno)
      stockFields.companybankaccno = req.body.companybankaccno;

    if (req.body.companybankbranch)
      stockFields.companybankbranch = req.body.companybankbranch;
    if (req.body.companybankifsccode)
      stockFields.companybankifsccode = req.body.companybankifsccode;
    if (req.body.companydeclaration)
      stockFields.companydeclaration = req.body.companydeclaration;

    errors.message = "Something Went Wrong, Company NOT CREATE!!";
    errors.className = "alert-danger";
    Company.findOne({
      companyname: stockFields.companyname
    })
      .then(company => {
        if (company) {
          //if its found requested companyname then it will throw error in res
          errors.message =
            "Company of this Name : " +
            stockFields.companyname +
            " " +
            " already in the Company !! You cannot add it again !!";
          errors.className = "alert-danger";
          res.status(400).json(errors);
        } else {
          //if requested companyname not found it means the stock admin wants to add its totally fresh or new company
          // Save the New company
          new Company(stockFields).save().then(company => res.json(company));
        }
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

router.get(
  "/singlecompanybyid/:id",

  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    var company_id = req.params.id;

    console.log("requested company id is : " + company_id);

    errors.message = "There Is No company info found in Company";
    errors.className = "alert-danger";

    Company.findOne({ _id: company_id })
      .then(company => {
        res.json(company);
      })
      .catch(err => res.status(404).json({ err }));
  }
);

// @route   DELETE api/company
// @desc    Delete company by its id
// @access  Private
router.delete(
  "/singlecompanyremove/:company_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    errors.message = "The Company Id is not found";
    errors.className = "alert-danger";

    Company.findOne({ _id: req.params.company_id })
      .then(company => {
        if (company) {
          Company.findByIdAndRemove({ _id: req.params.company_id }).then(() => {
            res.json({ success: "Company is deleted successfully" });
          });
        }
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

// @route   Post api/stock
// @desc    Edit product stock by their id
// @access  Private
router.put(
  `/updatesinglecompany/:paramid`,
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    // Get fields
    const errors = {};

    errors.message = "The Company Id is not found";
    errors.className = "alert-danger";

    Company.findOne({ _id: req.params.paramid })
      .then(company => {
        if (company) {
          // Update
          Company.findByIdAndUpdate(req.params.paramid, req.body, function(
            //req.body => stockdata that we send from its action from [editStock]
            err,
            company
          ) {
            if (err) return next(err);
            res.json(company);
          });
        }
      })
      .catch(err => res.status(404).json({ errors }));
  }
);

////////////
module.exports = router;
