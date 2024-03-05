const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController=require("../controllers/listings.js");

router
    .route("")
    .get(wrapAsync(listingController.index))//index route
    .post(isLoggedIn,validateListing,wrapAsync(listingController.create))//add new listing route

//new Listing Route
router.get("/new", isLoggedIn, listingController.renderCreateForm);//create listing route

router
    .route("/edit/:id")
    .put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.update))//update listing
    .get(isLoggedIn, isOwner, wrapAsync(listingController.renderUpdateForm))//edit listing


router
    .route("/:id")
    .get(wrapAsync(listingController.show))//show route
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.remove))//delete listing route


module.exports = router;
