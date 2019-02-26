const { calculateDistanceMatrix } = require("./commute.js");
const {
  createListing,
  createListingDistances,
  findListingByUrl
} = require("./repository.js");
const { scrapeListings } = require("./scrapper.js");

const STATION_PEEL = "Station Peel, Montréal, QC H3A 1T1";
const UDEM_PAV_L_GROULX = "Université de Montréal - Pavillon Lionel-Groulx";
const THRESHOLD_SECONDS = 45 * 60;

function isFarFarAway({ duration }) {
  return duration > THRESHOLD_SECONDS;
}

function mergeListingsAndDistances(listings, distances) {
  return listings.map((l, idx) => {
    return {
      listing: l,
      distances: [distances[idx * 2], distances[idx * 2 + 1]]
    };
  });
}

async function findPotentialApartmentsForRent() {
  const listings = await scrapeListings();

  const distances = await calculateDistanceMatrix(
    listings.map(({ lat, lng }) => `${lat},${lng}`),
    [STATION_PEEL, UDEM_PAV_L_GROULX]
  );

  const listingsAndDistances = mergeListingsAndDistances(listings, distances);

  const potentialOnes = listingsAndDistances.filter(
    ({ distances }) => !distances.some(d => isFarFarAway(d))
  );

  const found = [];

  for (const { listing: l, distances: dArr } of potentialOnes) {
    const existingOne = await findListingByUrl(l.url);

    if (!existingOne) {
      const listing = await createListing(l);
      await createListingDistances(listing.id, dArr);
      found.push(l.id);
    }
  }

  console.log("Finished scraping round");
  console.log(`${found.length} apartments found`);
}

module.exports = { findPotentialApartmentsForRent };
