const Listing=require("../models/listing.js")
const Review=require("../models/reviews.js")
module.exports.createReview=async (req, res) => {
    let { id } = req.params;
    let currReview = req.body.review;
    let currentListing = await Listing.findById(id);
    let newReview = Review(currReview);
    newReview.author=req.user._id;
    await newReview.save();
    currentListing.reviews.push(newReview);

    await currentListing.save();
    req.flash("success","Review Added !")
    console.log("Review added to DB !");
    // res.send("Review Added!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview=async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted ! ");
    res.redirect(`/listings/${id}`);
}