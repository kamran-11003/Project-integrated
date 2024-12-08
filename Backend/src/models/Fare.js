const mongoose = require("mongoose");

const FareSchema = new mongoose.Schema({
  rideType: {
    type: String,
    enum: [
      "Ride AC",
      "Ride Mini",
      "Motoride",
      "Horse",
      "Spiderman",
      "Superman",
    ],
    required: true,
  },
  fareMultiplier: {
    type: Number,
    required: true,
  },
  promotions: [
    {
      promotionCode: {
        type: String,
        required: true,
      },
      discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
      },
      validUntil: {
        type: Date,
        required: true,
      },
    },
  ],
});

// Use PascalCase for the model name
const Fare = mongoose.model("Fare", FareSchema);

module.exports = Fare;
