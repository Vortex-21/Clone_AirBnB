const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");


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
    let userId = req.user._id;
    newListing.owner = userId;
    // console.log(req.user);
    // console.log("newListing = ", newListing);
    // newListing.owner =
    await newListing.save();
    req.flash("success", "Listing Added Successfully!");
    res.redirect("/listings");
  })
);

//update listing route
router.put(
  "/editListing/:id",
  isLoggedIn,
  isOwner,
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

router.get("/edit/:id", isLoggedIn, isOwner, async (req, res) => {
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
    let listing = await Listing.findById(id)
      .populate({path:"reviews",
        populate:{
          path:"author",
        }
      })
      .populate("owner");
    
    
      // console.log(listing);

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
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
  })
);

module.exports = router;
