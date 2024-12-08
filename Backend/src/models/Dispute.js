// models/Dispute.js

const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
  issueDescription: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
  resolutionMessage: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Dispute", disputeSchema);
