module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        // req.session.redirectUrl = req.originalUrl;
        req.session.redirectUrl=req.originalUrl;
        // console.log(res.locals.redirectUrl);
        req.flash("error","You must be logged in to create a listing.");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectLocal=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
// module.exports={isLoggedIn,saveRedirectLocal};