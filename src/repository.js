const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const distanceSchema = new Schema({
  distance: Number,
  duration: Number,
  origin: String,
  destination: String,
  mode: String,
  _created_at: { type: Date, default: Date.now },
  _updated_at: { type: Date, default: Date.now }
});

const listingSchema = new Schema({
  title: String,
  url: String,
  description: String,
  image_url: String,
  published_at: Date,
  lat: String,
  lng: String,
  price: Number,
  distances: [distanceSchema],
  _created_at: { type: Date, default: Date.now },
  _updated_at: { type: Date, default: Date.now }
});

const rejectedUrlSchema = new Schema({ url: String });

const Listing = mongoose.model("Listing", listingSchema);
const RejectedUrl = mongoose.model("RejectedUrl", rejectedUrlSchema);

async function createListing(attrs, distances) {
  return Listing.create({ ...attrs, distances });
}

async function createRejectedUrl(url) {
  return RejectedUrl.create({ url });
}

async function findListingByUrl(url) {
  return new Promise((resolve, reject) => {
    Listing.findOne({ url }).exec((err, listing) => {
      if (err) {
        reject(err);
      }

      resolve(listing);
    });
  });
}

async function fetchListings(limit = 100) {
  return new Promise((resolve, reject) => {
    Listing.find({})
      .sort({ _created_at: "descending" })
      .limit(limit)
      .exec((err, listings) => {
        if (err) {
          reject(err);
        }

        resolve(listings);
      });
  });
}

async function fetchRejectedUrls() {
  return new Promise((resolve, reject) => {
    RejectedUrl.find({})
      .exec((err, rejectedUrls) => {
        if (err) {
          reject(err);
        }

        resolve(rejectedUrls);
      });
  });
}

module.exports = {
  createListing,
  createRejectedUrl,
  findListingByUrl,
  fetchListings,
  fetchRejectedUrls
};
