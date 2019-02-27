const express = require("express");
const mongoose = require("mongoose");
const { fetchListings } = require("./repository.js");

require("./cron.js");

const app = express();
const port = process.env.PORT || 3000;

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

app.get("/listings", async function(req, res) {
  const listings = await fetchListings();

  res.json(listings);
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
