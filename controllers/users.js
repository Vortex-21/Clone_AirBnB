const User=require("../models/user.js")
module.exports.signup=async (req, res, next) => {
    // console.log(req.body);
    try {
      let { currUser } = req.body;
      let newUser = User({
        email: currUser.email,
        username: currUser.username,
      });

      let registeredUser = await User.register(newUser, currUser.password);
      // console.log(registeredUser);
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
}

module.exports.login=async (req, res) => {
    req.flash("success", "Logged in successfully!");
    // console.log(res.locals.redirectUrl);
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.renderSignupForm=(req, res) => {
  res.render("users/signup.ejs");
  // res.send("form");
}

module.exports.renderLoginForm=(req, res) => {
  res.render("users/login.ejs");
}

module.exports.logout=(req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You're logged out !");
    res.redirect("/listings");
  });
}