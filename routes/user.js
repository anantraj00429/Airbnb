const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");
const {
  renderSignupForm,
  renderLoginForm,
} = require("../controllers/users.js");

router.get("/signup", renderSignupForm);

router.post("/signup", wrapAsync(userController.signUser));

router.get("/login", renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.loginUser
);

router.get("/logout", userController.logoutUser);

module.exports = router;
