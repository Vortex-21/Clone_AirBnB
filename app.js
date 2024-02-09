const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const listingSchema = require("./schema.js")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")))
app.engine("ejs",ejsMate);


async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => {
    console.log("Connection Successful!");
  })
  .catch((err) => {
    console.log("ERROR: ============>", err);
  });

//test Listings route

app.get("/testListings", async(req, res, next) => {
  let sampleListing = new Listing({
    title: "Home",
    description: "Dream come true",
    price: 2000000000,
    location: "Unknown Location",
    country: "Unknown Country",
  });

  await sampleListing
    .save()
    .then((results) => {
      console.log("Saved Successfully");
      res.send(results);
    })
    .catch((err) => {
      next(err);
    });
});
const validateListing=(req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    // throw new ExpressError(400,error);
    let errMsg = error.details.map((er)=>er.message).join(',');
    throw new ExpressError(400,errMsg);
  }
  else{
    next();
  }
}
//All Listings Route/index
app.get("/listings", async (req, res) => {
  let allListings = await Listing.find();
  // console.log(typeof(allListings));
  res.render("listings/index.ejs", { allListings });
});

//Create new Listing Route
app.get("/listings/new", (req, res) => {
  res.render("listings/newListing.ejs");
});
app.post("/listings",validateListing, wrapAsync(async(req, res, next) => {
  // if(!req.body.listing){
  //   console.log(req.body.listing)
  //   throw new ExpressError(400,"Send Valid Data for Listing!");
  // }
  // const result = listingSchema.validate(req.body);
  // console.log(result);
  // if(result.error){
  //   throw new ExpressError(400,result.error);
  // }
  let newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));
//edit listing route
app.put("/listings/editListing/:id",validateListing, wrapAsync(async (req, res) => {
  let edittedListing = req.body.listing;
  let { id } = req.params;
  // try {
  //   await Listing.findByIdAndUpdate(
  //     id,
  //     { ...edittedListing },
  //     { runValidators: true }
  //   );
  //   res.redirect(`/listings/${id}`);
  // } catch (err) {
  //   console.log("ERROR: ", err);
  // }
  await Listing.findByIdAndUpdate(
    id,
    {...edittedListing},
    {runValidators:true}
  );
  res.redirect(`/listings/${id}`);
}));

app.get("/listings/edit/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/editDetails.ejs", { listing });
});

//Show listing Details Route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/listingDetails.ejs", { listing });
}));

//Remove Listing Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  
  
}));
//Root
app.get("/", (req, res) => {
  res.send("Working!");
});

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"));
})

app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went Wrong"}=err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{message});
})

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
