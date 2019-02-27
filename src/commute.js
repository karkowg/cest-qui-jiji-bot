const mapsClient = require("@google/maps").createClient({
  key: process.env.GOOGLE_API_KEY,
  Promise: Promise
});

const formatElement = (element, mode) => ({
  distance: element.distance.value, // meters
  duration: element.duration.value, // seconds
  origin: element.origin,
  destination: element.destination,
  mode
});

async function calculateDistanceMatrix(
  origins,
  destinations,
  mode = "transit"
) {
  const t8am = new Date();
  t8am.setHours(8, 0, 0);

  const { json } = await mapsClient
    .distanceMatrix({
      origins,
      destinations,
      mode,
      departure_time: t8am
    })
    .asPromise();

  const distances = [];
  const { status, rows } = json;

  if (status === "OK") {
    for (const [oIdx, orig] of json.origin_addresses.entries()) {
      for (const [dIdx, dest] of json.destination_addresses.entries()) {
        const element = rows[oIdx].elements[dIdx];

        if (element.status === "OK") {
          element.origin = orig;
          element.destination = dest;

          distances.push(formatElement(element, mode));
        } else {
          distances.push({});
        }
      }
    }
  }

  return distances;
}

module.exports = { calculateDistanceMatrix };
