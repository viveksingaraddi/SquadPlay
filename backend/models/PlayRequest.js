const mongoose = require("mongoose");

const playRequestSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
    game: { type: String, required: true },
    arena: { type: String, required: true },
    time: { type: String, required: true },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlayRequest", playRequestSchema);
