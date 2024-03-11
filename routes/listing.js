const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("")
  .get(wrapAsync(listingController.index)) //index route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.create)
  ); //add listing route
// .post(upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// })

//new Listing Route
router.get("/new", isLoggedIn, listingController.renderCreateForm); //create listing route

router
  .route("/edit/:id")
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.update)
  ) //update listing
  .get(isLoggedIn, isOwner, wrapAsync(listingController.renderUpdateForm)); //edit listing

router
  .route("/:id")
  .get(wrapAsync(listingController.show)) //show route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.remove)); //delete listing route

module.exports = router;
