const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

const passport = require("passport");

const nodemailer = require("nodemailer");

const { ensureAuthenticated, isAdmin } = require("../../config/auth"); //this middleware check only login user can access routes

// Load Input Validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body); //here we pulled out errors and isValid from validateRegisterInput() this function where re.body include everything that sent to its routes in this case name,email,mobile and password

  // Check Validation
  if (!isValid) {
    //if isValid is not empty its mean errors object has got some errors so in this case it will redirect to the register
    return res.status(400).json(errors);
  }

  //User => its User model
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm" // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash; //set password to hash password
          newUser
            .save()
            .then(user => res.json(user)) //here we send back new user register information as a response from the success server side
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body); //here we pulled out errors and isValid from validateRegisterInput() this function where re.body include everything that sent to its routes in this case name,email,mobile and password

  // Check Validation
  if (!isValid) {
    //if isValid is not empty its mean errors object has got some errors so in this case it will redirect to the register
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    //using this user we can access all the information like user.id,user.email,user.mobile etc

    // Check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // res.json({ msg: "Success" });

        // User Matched

        const payload = {
          id: user.id,
          role: user.role,
          name: user.name,
          mobile: user.mobile,
          avatar: user.avatar
        }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey, //here we set the key(secret from the config/keys.js) with payload(login user information)
          { expiresIn: 3600 }, //3600 hour the key will expire the user should again login
          (err, token) => {
            //here we set the token and send as response to the authenticated user
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});

// @route   GET api/users/current   //who ever token belongs too
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      mobile: req.user.mobile
    });
  }
);

router.post("/forgotpassword", (req, res) => {
  const email = req.body.email;

  // Find user by email
  User.findOne({ email }).then(user => {
    //using this user we can access all the information like user.id,user.email,user.mobile etc

    let errors = {};
    let emailexist = true;
    // Check for user
    if (!user) {
      console.log("Your Email is not exist !!");
      errors.message = "Your Email is not exist !!";
      errors.className = "alert-danger";
      emailexist = false;
      return res.status(404).json(errors);
    }

    if (emailexist) {
      let useremail = user.email;
      let userpassword = user.password;
      console.log(
        "user email is exist!! Ready to send password reset link to user email : " +
          useremail
      );
      const output = `
      <p>You have a new contact request</p>
      <h3>Contact Details</h3>
      <ul>  
        <li>Your Email: ${useremail}</li> 
      </ul>
      <h3>Message</h3>
      <p>click this link to reset your password : http://localhost:3000/forgot-password-reset</p>
    `;

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "mail.nvoos.com",
        port: 25,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "test@nvoos.com", // your nvoos email address like test@nvoos.com
          pass: "test@123" //password
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // setup email data with unicode symbols
      let mailOptions = {
        from: "test@nvoos.com", // sender address
        to: `${useremail}`, // list of receivers
        subject: "Reset Your Password || Earthmoving Software", // Subject line
        text: "Reset Your Password", // plain text body
        html: output // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.json({ success: "check your mail" });
      });
    }
  });
});

module.exports = router;
