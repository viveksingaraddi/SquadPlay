const mongoose = require("mongoose");

const playRequestSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
    game: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlayRequest", playRequestSchema);
