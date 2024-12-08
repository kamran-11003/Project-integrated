const mongoose = require("mongoose");

// Assuming you have a Driver model, or you can update this with a valid reference
const RatingSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId, // Change from String to ObjectId
    ref: "Driver", // Reference to the Driver model
    required: true,
  },
  rating: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Rating", RatingSchema);
