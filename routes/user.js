const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { register } = require("../models/reviews");
const {saveRedirectLocal}=require("../middleware.js")
console.log(saveRedirectLocal);
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
  // res.send("form");
});

router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    // console.log(req.body);
    try {
      let { currUser } = req.body;
      let newUser = User({
        email: currUser.email,
        username: currUser.username,
      });

      let registeredUser = await User.register(newUser, currUser.password);
      console.log(registeredUser);
      req.login(registeredUser, (err) => {
        if (err) {
          next(err);
        } else {
          req.flash("success", "You Have Registered Successfully!");
          res.redirect("/listings");
        }
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  })
);

router.post(
  "/login",
  saveRedirectLocal,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Logged in successfully!");
    console.log(res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You're logged out !");
    res.redirect("/listings");
  });
});

module.exports = router;
