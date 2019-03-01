const cron = require("node-cron");
const { findPotentialApartmentsForRent } = require("./bot.js");

// every 30 minutes
cron.schedule("*/30 * * * *", () => {
  findPotentialApartmentsForRent();
});
