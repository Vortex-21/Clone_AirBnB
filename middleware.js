const Listing = require("./models/listing");
const Review = require("./models/reviews");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // req.session.redirectUrl = req.originalUrl;
    req.session.redirectUrl = req.originalUrl;
    // console.log(res.locals.redirectUrl);
    req.flash("error", "You must be logged in.");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectLocal = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  // console.log(req.params);
  const { id } = req.params;
  // console.log("id = ", id);
  let listing = await Listing.findById(id);
  // console.log("Owner = ", listing.owner);
  // console.log("currUser = ", res.locals.currUser);
  if (res.locals.currUser && !listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission for this action.");
    return res.redirect(`/listings/${id}`);
  }
  // console.log("done...");
  next();
};


module.exports.isAuthor = async (req, res, next) => {
  // console.log(req.params);
  const { id,reviewId } = req.params;
  // console.log("id = ", id);
  
  let review = await Review.findById(reviewId);
  // console.log("Owner = ", listing.owner);
  // console.log("currUser = ", res.locals.currUser);
  if (res.locals.currUser && (!review.author.equals(res.locals.currUser._id))) {
    req.flash("error", "You don't have permission for this action.");
    return res.redirect(`/listings/${id}`);
  }
  // console.log("done...");
  next();
};


module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    // throw new ExpressError(400,error);
    console.log(error);
    let errMsg = error.details.map((er) => er.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log(error);
    let errMsg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};
