const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// requiring listing
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
// requiring review

const listingController = require("../controllers/listings.js");

const multer  = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage });




// Index Route

router.get("/", wrapAsync(listingController.index));

// Search Route
router.get("/search", wrapAsync(listingController.searchListings));

// New Route

router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show Route

router.get("/:id", wrapAsync(listingController.showListing));
// this will find the listing by id and populate the reviews and owner

// create route
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing)
);




// edit route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// update route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)
);

// DELETE route

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);
// this route will be used to delete the listing from the database

module.exports = router;
