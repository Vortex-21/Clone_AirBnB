const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");
const validateListing = (req, res, next) => {
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

//All Listings Route/index
router.get("", async (req, res) => {
  let allListings = await Listing.find();
  // console.log(typeof(allListings));
  res.render("listings/index.ejs", { allListings });
});

//Create new Listing Route
router.get("/new", isLoggedIn, (req, res) => {
  // console.log(req.user);
  res.render("listings/newListing.ejs");
});
router.post(
  "",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "Listing Added Successfully!");
    res.redirect("/listings");
  })
);

//update listing route
router.put(
  "/editListing/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let edittedListing = req.body.listing;
    let { id } = req.params;
    let result = await Listing.findByIdAndUpdate(
      id,
      { ...edittedListing },
      { runValidators: true }
    );
    req.flash("success", "Listing updated successfully !");
    res.redirect(`/listings/${id}`);
  })
);

router.get("/edit/:id",isLoggedIn, async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Does not Exist ! ");
    res.redirect("/listings");
  }
  res.render("listings/editDetails.ejs", { listing });
});

//Show listing Details Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing you asked for, does not exist !");
      res.redirect("/listings");
    }
    res.render("listings/showListingDetails.ejs", { listing });
  })
);

//Delete Listing Route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
  })
);

module.exports = router;
