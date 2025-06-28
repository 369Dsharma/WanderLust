const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()) {

      req.session.redirectUrl = req.originalUrl;
      // this will store the current path in session
        req.flash("error", "You must be signed in to create a listing!");
        return res.redirect("/login");
      }
      // this route will render the new listing page
      // and will send the response to the client
      // and will show the new listing page to the user
      // this route will be used to create a new listing
      next();
}   

// as passport will reset the session after login so we need to store the current path in locals using middleware

module.exports.saveRedirectUrl = (req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
    // this will store the current path in locals
    // and then we will redirect to that path after login
  }
  next();
};

module.exports.isOwner = async (req,res,next)=>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  // this will find the listing by id and store it in the listing variable
  if(!listing.owner.equals(res.locals.currentUser._id)){
    req.flash("error", "You can't do so as , You are not the owner of this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

// middleware for validating the listing schema
// this middleware will check if the listing is valid or not
module.exports.validateListing = (req,res,next)=>{
  
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
};


// middleware for validating the review schema
module.exports.validateReview = (req,res,next)=>{
  
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errMsg = error.details.map((el)=> el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  };
  
// isAuthor middleware to delete the review 
// this middleware will check if the user is the author of the review or not
// and will redirect to the listing page if the user is not the author of the review

module.exports.isReviewAuthor = async (req,res,next)=>{
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  // this will find the review by id and store it in the review variable
  if(!review.author.equals(res.locals.currentUser._id)){
    req.flash("error", "You can't do so as , You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
// this will check if the user is the author of the review or not
