const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");
// this will be used to create the user schema

router.get("/signup", userController.renderSignupForm);
// this route will render the signup page

router.post(
  "/signup",
  wrapAsync(userController.signUp),
);
// this route will handle the signup form submission

// login route
router.get("/login", userController.renderLoginForm);

// this route will render the login page

router.post(
  "/login",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.loginUser
  // this route will handle the login form submission

  // and will redirect to the listings page
  // and will show the listings there
);

// this route will handle the login form submission

// logout route
router.get("/logout", userController.logoutUser);
// this route will render the logout page
// this route will handle the logout form submission

module.exports = router;
// this will export the router
