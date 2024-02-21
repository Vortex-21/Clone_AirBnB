const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js")
const session = require('express-session')
const listingRoutes = require('./routes/listing.js')
const reviewRoutes = require('./routes/review.js')
const flash = require('connect-flash')

const sessionOptions = {
  secret:'mysecretKey',
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires : Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
};

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

app.use(session(sessionOptions));
app.use(flash())

app.use((req,res,next)=>{
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
})


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
