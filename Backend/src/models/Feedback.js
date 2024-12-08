const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId, // Change from String to ObjectId
    ref: "Driver", // Reference to the Driver model
    required: true,
  },
  feedback: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Feedback", FeedbackSchema);
