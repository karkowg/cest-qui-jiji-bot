const express = require("express");
const mongoose = require("mongoose");
const { fetchListings } = require("./repository.js");
const { findPotentialApartmentsForRent } = require("./bot.js");

const app = express();

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${
      process.env.DB_HOST
    }`,
    { dbName: process.env.DB_NAME, useNewUrlParser: true }
  )
  .then(() => {
    console.log("Mongoose connected");
  })
  .catch(console.error);

app.get("/", async function(req, res) {
  // await findPotentialApartmentsForRent();
  const listings = await fetchListings();

  res.json(listings);
});

app.listen(8888, () => console.log("Listening on port 8888!"));
