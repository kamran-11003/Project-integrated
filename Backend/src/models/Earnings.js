const mongoose = require("mongoose");

const EarningsSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0, // Ensure the earning amount is non-negative
  },
  date: {
    type: Date,
    required: true,
    default: Date.now, // Default to the current date and time
  },
});

const Earnings = mongoose.model("Earnings", EarningsSchema);

module.exports = Earnings;
