const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String, default: "" },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    bio: { type: String, default: "" },
    preferredGames: { type: [String], default: [] },
    skillLevel: { type: String, enum: ["beginner", "intermediate", "advanced", ""], default: "" },
    availability: { type: [String], default: [] },
    lastConnections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);