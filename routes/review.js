const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isAuthor}=require("../middleware.js");
const reviewController  = require("../controllers/reviews.js");

//Add Review Route
router.post(
  "/",
  validateReview,
  wrapAsync(reviewController.createReview)
);

//Delete Review Route
router.delete(
  "/:reviewId",
  isAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
