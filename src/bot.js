const { calculateDistanceMatrix } = require("./commute.js");
const {
  createListing,
  createRejectedUrl,
  findListingByUrl,
  fetchRejectedUrls
} = require("./repository.js");
const { scrapeListings } = require("./scrapper.js");

const STATION_PEEL_LAT_LNG = ["45.5008878", "-73.5746008"];
const UDEM_PAV_L_GROULX_LAT_LNG = ["45.4991188", "-73.6180281"];
const THRESHOLD_SECONDS = 45 * 60;

const destinations = [STATION_PEEL_LAT_LNG, UDEM_PAV_L_GROULX_LAT_LNG];

function isFarFarAway({ duration }) {
  return ! duration || duration > THRESHOLD_SECONDS;
}

function mergeListingsAndDistances(listings, distances, distancesPerListing) {
  return listings.map((l, idx) => {
    return {
      listing: l,
      distances: [
        distances[idx * distancesPerListing],
        distances[idx * distancesPerListing + 1]
      ]
    };
  });
}

async function findPotentialApartmentsForRent() {
  console.log("--- Started scraping round ---");

  let listings = await scrapeListings();

  const rejectedUrls = await fetchRejectedUrls();

  const isRejectedUrl = u => rejectedUrls
    .map(({ url }) => url)
    .includes(u);

  // filter out listings present in rejected urls collection
  listings = listings.filter(({ url }) => ! isRejectedUrl(url));

  if (! listings) {
    console.log('No listings, aborting scraping round');
    return;
  }

  let distances;

  try {
    distances = await calculateDistanceMatrix(
      listings.map(({ lat, lng }) => [lat, lng]),
      destinations
    );
  } catch (err) {
    console.error(`Google API error: ${err}`);
    return;
  }

  if (! distances) {
    console.log('No distances, aborting scraping round');
    return;
  }

  // merge listings with their associated distances
  const listingsAndDistances = mergeListingsAndDistances(
    listings,
    distances,
    destinations.length
  );

  const potentialOnes = listingsAndDistances.filter(
    ({ distances }) => ! distances.some(d => isFarFarAway(d))
  );

  const rejectedOnes = listingsAndDistances.filter(
    ({ distances }) => distances.some(d => isFarFarAway(d))
  );

  const found = [];

  // persist potential listings to listings collection
  for (const { listing, distances: dArr } of potentialOnes) {
    const existingOne = await findListingByUrl(listing.url);

    if (! existingOne) {
      const l = await createListing(listing, dArr);
      found.push(l._id);
    }
  }

  const rejected = [];

  // persist rejected listings to rejected urls collection
  for (const { listing } of rejectedOnes) {
    const { url } = listing;

    if (! isRejectedUrl(url)) {
      const ru = await createRejectedUrl(url);
      rejected.push(ru._id);
    }
  }

  console.log(`${found.length} apartments found, ${rejected.length} rejected`);
  console.log("Finished scraping round");
}

module.exports = { findPotentialApartmentsForRent };
