const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  _id: Schema.Types.ObjectId,
  title: String,
  url: String,
  description: String,
  image_url: String,
  published_at: Date,
  lat: String,
  lng: String,
  price: Number,
  distances: [{ type: Schema.Types.ObjectId, ref: "Distance" }],
  _created_at: { type: Date, default: Date.now },
  _updated_at: { type: Date, default: Date.now }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
