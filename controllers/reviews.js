const Review = require('../models/review');
const Listing = require('../models/listing');

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; // this will set the author of the review to the user who is logged in
    // this will set the author of the review to the user who is logged in
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully, New review created!");
   
    res.redirect(`/listings/${listing._id}`);
  };

  module.exports.destroyReview =     async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //listing id find krke usme review array me se reviewId ko pull krdo
    // this will remove the review from the listing.
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted!");
    res.redirect(`/listings/${id}`);
  };