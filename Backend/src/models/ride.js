const mongoose = require("mongoose");

// Schema for ride details
const rideSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver", // Reference to the Driver model
      default: null, // Driver may not be assigned initially
    },
    status: {
      type: String,
      enum: ["ongoing", "completed"],
      default: "requested", // Ride status (requested by default)
    },
    pickupCoordinates: {
      type: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
      required: true,
    },
    dropOffCoordinates: {
      type: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
      default: null, // May not be available if the ride is in progress
    },
    distance: {
      type: Number, // Distance in meters (optional)
      default: null,
    },
    price: {
      type: Number, // Price of the ride (optional)
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending", // Payment status (pending by default)
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create the Ride model
const Ride = mongoose.model("Ride", rideSchema);

module.exports = Ride;
