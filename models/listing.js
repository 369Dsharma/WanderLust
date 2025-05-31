const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
   url : String,
   filename : String,
  },
  price: Number,
  location: String,
  country: String,
  reviews : [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner : {
    type: Schema.Types.ObjectId,
    ref: "User",  
  }
});

// this is a mongoose middleware which will remove the review from the listing when the listing is deleted

listingSchema.post("findOneAndDelete", async(listing)=>{
  if (listing) {
    await Review.deleteMany({
      _id: {
        $in: listing.reviews,
      },
    });
  }

  // after deleting listing this middleware will be called and delete all the reviews related to the deleted listing
});
// this is a middleware which will remove the review from the listing when the listing is deleted

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;