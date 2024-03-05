const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectLocal}=require("../middleware.js")
const userController=require("../controllers/users.js")

//Signup Route
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup))


//Login Route
router
  .route("/login")
  .post(
    saveRedirectLocal,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    wrapAsync(userController.login)
  )
  .get(userController.renderLoginForm)


//Logout Route
router.get("/logout", userController.logout);

module.exports = router;
