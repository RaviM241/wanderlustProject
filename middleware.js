const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpresError = require("./utils/ExpressError.js");
const { listingSchema ,reviewSchema} = require("./Schema.js");

   module.exports.isLoggedIn =(req,res,next)=>{
  if(!req.isAuthenticated()){
    req.session.redirectUrl = req.originalUrl;
    req.flash("error","You must be logged in to create listing!");
    return res.redirect("/login");
  }
  next();
};

module.exports.seveRedirectUrl=(req,res,next)=>{
         if(req.session.redirectUrl){
          res.locals.redirectUrl =req.session.redirectUrl;
         };
next();
};

module.exports.isOwner = async (req,res,next)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not owner of this listing!");
    return res.redirect(`/listings/${id}`);
  };
  next();
};

//listings validatetion
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
     let errMsg = error.details.map((el) => el.message).join(",");
     throw new ExpresError(400, errMsg);
  } else {
     next();
  }
};

// review validation
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpresError(400, errMsg);
  } else {
      next();
  }
};
module.exports.isReviewAuther = async (req,res,next)=>{
  let {id,reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if(!review.auther.equals(res.locals.currUser._id)){
    console.log(review.auther);
    req.flash("error","You are not auther of this Review!");
    return res.redirect(`/listings/${id}`);
  };
  next();
};