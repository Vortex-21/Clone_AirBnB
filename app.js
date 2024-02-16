const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")

const listingRoutes = require('./routes/listing.js')
const reviewRoutes = require('./routes/review.js')


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

app.use('/listings',listingRoutes);
app.use('/listings/:id/reviews',reviewRoutes)

//Root
app.get("/", (req, res) => {
  res.send("Working!");
});

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"));
});

app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went Wrong"}=err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs",{message});
})

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
