const mongoose = require("mongoose");

const arenaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    city: { type: String },
    category: { type: [String], default: [] }, // e.g., ["Football", "Cricket"]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Arena", arenaSchema);
