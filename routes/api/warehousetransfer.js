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

//Exports
module.exports = router;
