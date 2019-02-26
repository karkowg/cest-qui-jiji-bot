const distance = require("google-distance");

distance.apiKey = process.env.GOOGLE_API_KEY;

const formatDistance = data => ({
  distance: data.distanceValue, // meters
  duration: data.durationValue, // seconds
  origin: data.origin,
  destination: data.destination,
  mode: data.mode
});

function calculateDistanceMatrix(origins, destinations, mode = "transit") {
  return new Promise((resolve, reject) => {
    distance.get({ origins, destinations, mode }, (err, data) => {
      if (err) {
        reject(err);
      }

      resolve(data.map(d => formatDistance(d)));
    });
  });
}

module.exports = { calculateDistanceMatrix };
