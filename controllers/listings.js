const Listing=require("../models/listing.js")
const axios=require("axios")
module.exports.index = async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
}
module.exports.create=async (req, res, next) => {
    let url= req.file.path;
    let filename=req.file.filename;
    let newListing = new Listing(req.body.listing);
    let userId = req.user._id;
    newListing.owner = userId;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success", "Listing Added Successfully!");
    res.redirect("/listings");
}

module.exports.update=async (req, res) => {
    let edittedListing = req.body.listing;
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(
      id,
      { ...edittedListing },
      { runValidators: true }
    );
    if(req.file){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
    }
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
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_250,w_300");
    res.render("listings/editDetails.ejs", { listing, originalImageUrl});
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
    
    
    // let coord = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${process.env.GMAP_KEY}`)
    // console.log("coord = ",coord.data.results[0].geometry.location.lat);

    if (!listing) {
      req.flash("error", "Listing you asked for, does not exist !");
      res.redirect("/listings");
    }
    res.render("listings/showListingDetails.ejs", { listing});
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