const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema} = require("../schema.js");
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
router.get("/new", (req, res) => {
  res.render("listings/newListing.ejs");
});
router.post(
  "",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);


//edit listing route
router.put(
  "/editListing/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let edittedListing = req.body.listing;
    let { id } = req.params;
    await Listing.findByIdAndUpdate(
      id,
      { ...edittedListing },
      { runValidators: true }
    );
    res.redirect(`/listings/${id}`);
  })
);

router.get("/edit/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/editDetails.ejs", { listing });
});


//Show listing Details Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");

    res.render("listings/showListingDetails.ejs", { listing });
  })
);

//Delete Listing Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  })
);



module.exports = router;
