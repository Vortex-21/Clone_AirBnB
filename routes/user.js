const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync=require("../utils/wrapAsync");
const passport = require("passport")
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
    // res.send("form");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    // console.log(req.body);
    try
    {let {currUser} = req.body;
    let newUser = User({
        email:currUser.email,
        username:currUser.username 
    });

    let result = await User.register(newUser,currUser.password);
    console.log(result);
    req.flash("success","You Have Registered Successfully!");
    res.redirect("/listings");}
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup")
    }
}));

router.post("/login",passport.authenticate("local",{failureRedirect: "/login",failureFlash:true}),async(req,res)=>{
    req.flash("success","Logged in successfully!");
    res.redirect("/listings");
})

router.get("/login",(req,res)=>{
    
    res.render("users/login.ejs");

})

module.exports = router;
