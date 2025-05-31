const express = require("express");
const router = express.Router({ mergeParams: true }); // this will merge the params of the listing and review routes
// this will help us to get the listing id from the review route
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

// requiring review
const Review = require("../models/review.js");
// requiring listing
const Listing = require("../models/listing.js");

const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
// requiring review
// this will be used to create the review schema
// and will be used to validate the review data from the client side

const reviewController = require("../controllers/reviews.js");
// this will be used to create the review schema

// Review Route-> POST Route
// this route will be used to add review to the listing
// and will redirect to the listing page
// and will show the reviews there
// also we have used a middleware to validate the review schema from client side as well
// we have applied wrapAsync to handle the async errors
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);
// this route will be used to add review to the listing

// Review Delete Route
// this route will be used to delete the review from the listing
// and will redirect to the listing page

// and will show the reviews there

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
