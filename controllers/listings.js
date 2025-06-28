const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
  };

module.exports.searchListings = async (req, res) => {
  const { q } = req.query;
  let allListings;
  
  if (q) {
    // Create a case-insensitive search query for multiple fields
    const searchQuery = {
      $or: [
        { location: { $regex: q, $options: "i" } },
        { country: { $regex: q, $options: "i" } },
        { title: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } }
      ]
    };
    allListings = await Listing.find(searchQuery);
  } else {
    allListings = await Listing.find({});
  }
  
  res.render("./listings/index.ejs", { allListings, searchQuery: q });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
  };

  module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");

    // this will find the listing by id and populate the reviews and owner
    // and will show the reviews and owner in the listing page
    // and will show the listing page to the user
    
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    console.log(listing);
    // this will find the listing by id and populate the reviews and owner
    res.render("./listings/show.ejs", { listing });
  };

  module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.image = {url , filename};
    newListing.owner = req.user._id;
    // this will set the owner of the listing to the user who is logged in
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
  };

  module.exports.renderEditForm = async (req, res) => {
      let { id } = req.params;
      const listing = await Listing.findById(id);
      if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
      }

      let originalImageUrl = listing.image.url;
      originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250");
      res.render("./listings/edit.ejs", { listing , originalImageUrl });
    };

    module.exports.updateListing =async (req, res) => {
        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

        if(typeof req.file !== "undefined"){
          let url = req.file.path;
          let filename = req.file.filename;
          listing.image = {url , filename};
          await listing.save();
        }

        req.flash("success", "Listing updated!...");
        res.redirect(`/listings/${id}`);
      };

      module.exports.destroyListing = async (req, res) => {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        req.flash("success", "Successfully deleted the listing!");
        console.log(deletedListing);
        res.redirect("/listings");
      };

