const Listing=require("../models/listing.js")
module.exports.index = async (req, res) => {
    let allListings = await Listing.find();
    // console.log(typeof(allListings));
    res.render("listings/index.ejs", { allListings });
}
module.exports.create=async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    let userId = req.user._id;
    newListing.owner = userId;
    await newListing.save();
    req.flash("success", "Listing Added Successfully!");
    res.redirect("/listings");
}

module.exports.update=async (req, res) => {
    let edittedListing = req.body.listing;
    let { id } = req.params;
    let result = await Listing.findByIdAndUpdate(
      id,
      { ...edittedListing },
      { runValidators: true }
    );
    req.flash("success", "Listing updated successfully !");
    res.redirect(`/listings/${id}`);
}

module.exports.renderUpdateForm=async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing Does not Exist ! ");
      res.redirect("/listings");
    }
    res.render("listings/editDetails.ejs", { listing });
}

module.exports.show=async (req, res) => {
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
}

module.exports.remove=async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully");
    res.redirect("/listings");
}

module.exports.renderCreateForm=(req, res) => {
  // console.log(req.user);
  res.render("listings/newListing.ejs");
}