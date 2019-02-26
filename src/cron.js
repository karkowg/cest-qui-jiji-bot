const cron = require("node-cron");
const { findPotentialApartmentsForRent } = require("./bot.js");

cron.schedule("*/10 * * * *", () => {
  findPotentialApartmentsForRent();
});
