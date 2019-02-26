const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const distanceSchema = new Schema({
  _id: Schema.Types.ObjectId,
  distance: Number,
  duration: Number,
  origin: String,
  destination: String,
  mode: String,
  listing: { type: Schema.Types.ObjectId, ref: "Listing" },
  _created_at: { type: Date, default: Date.now },
  _updated_at: { type: Date, default: Date.now }
});

const Distance = mongoose.model("Distance", distanceSchema);

module.exports = Distance;
