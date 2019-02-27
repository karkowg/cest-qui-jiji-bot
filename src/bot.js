const { calculateDistanceMatrix } = require("./commute.js");
const { createListing, findListingByUrl } = require("./repository.js");
const { scrapeListings } = require("./scrapper.js");

const STATION_PEEL_LAT_LNG = ["45.5008878", "-73.5746008"];
const UDEM_PAV_L_GROULX_LAT_LNG = ["45.4991188", "-73.6180281"];
const THRESHOLD_SECONDS = 45 * 60;

const destinations = [STATION_PEEL_LAT_LNG, UDEM_PAV_L_GROULX_LAT_LNG];

function isFarFarAway({ duration }) {
  return !duration || duration > THRESHOLD_SECONDS;
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
  const listings = await scrapeListings();

  if (!listings) {
    return;
  }

  let distances;

  try {
    distances = await calculateDistanceMatrix(
      listings.map(({ lat, lng }) => [lat, lng]),
      destinations
    );
  } catch (err) {
    console.error(err);
    return;
  }

  const listingsAndDistances = mergeListingsAndDistances(
    listings,
    distances,
    destinations.length
  );

  const potentialOnes = listingsAndDistances.filter(
    ({ distances }) => !distances.some(d => isFarFarAway(d))
  );

  const found = [];

  for (const { listing: l, distances: dArr } of potentialOnes) {
    const existingOne = await findListingByUrl(l.url);

    if (!existingOne) {
      const listing = await createListing(l, dArr);
      found.push(listing.id);
    }
  }

  console.log("Finished scraping round");
  console.log(`${found.length} apartments found`);
}

module.exports = { findPotentialApartmentsForRent };
