const mongoose = require("mongoose");
const Distance = require("./models/Distance.js");
const Listing = require("./models/Listing.js");

async function createListing(attrs) {
  const listing = Listing.create({
    _id: new mongoose.Types.ObjectId(),
    ...attrs
  });

  return listing;
}

async function createListingDistances(listingId, distancesArr) {
  const distances = Distance.create(
    distancesArr.map(d => ({
      _id: new mongoose.Types.ObjectId(),
      listing: listingId,
      ...d
    }))
  );

  return distances;
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
      .populate("distances")
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

module.exports = {
  createListing,
  createListingDistances,
  findListingByUrl,
  fetchListings
};
