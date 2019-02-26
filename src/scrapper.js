const got = require("got");
const { parseString } = require("xml2js");
const { promisify } = require("util");

const parseStringAsync = promisify(parseString);

const LISTINGS_URL =
  "https://www.kijiji.ca/rss-srp-appartement-condo/ville-de-montreal/c37l1700281";

const fetchListings = options => got(LISTINGS_URL, options);

const formatListing = data => ({
  title: data.title,
  url: data.link,
  description: data.description,
  image_url: data.enclosure ? data.enclosure.$.url : null,
  published_at: data["dc:date"],
  lat: data["geo:lat"],
  lng: data["geo:long"],
  price: Number(data["g-core:price"])
});

async function scrapeListings() {
  const { body } = await fetchListings({
    query: {
      ad: "offering",
      price: "650__950",
      "a-louer-par": "ownr"
    }
  });

  const { rss } = await parseStringAsync(body, { explicitArray: false });

  const items = rss.channel ? rss.channel.item : [];

  return items.map(i => formatListing(i));
}

module.exports = { scrapeListings };
