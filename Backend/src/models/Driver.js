const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Simple regex for phone number (you can customize it as needed)
          return /\+?[0-9]{7,15}/.test(v);
        },
        message: "Invalid phone number format",
      },
    },

    // Identity Information
    idNumber: {
      type: String,
      required: true,
    },
    licenseNumber: {
      type: String,
      required: true,
    },
    licenseImage: {
      type: String, // Store file path or URL to the image
      required: true,
    },
    profileImage: {
      type: String, // Store file path or URL to the image
      required: true,
    },

    // Vehicle Information
    vehicleMake: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    vehicleYear: {
      type: Number,
      required: true,
    },
    plateNumber: {
      type: String,
      required: true,
    },

    // Approval, Suspension, and Availability
    approved: {
      type: Boolean,
      default: false, // Default to not approved
    },
    suspensionStatus: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active", // Default to active status
    },
    availability: {
      type: Boolean,
      default: true, // Default to available
    },

    // Location Information (Optional)
    location: {
      type: {
        type: String,
        enum: ["Point"], // GeoJSON type
        default: "Point",
      },
      coordinates: {
        type: [Number], // Array of numbers: [longitude, latitude]
        required: false, // Location is optional
        validate: {
          validator: function (v) {
            return !v || v.length === 2; // Ensure it's valid if provided
          },
          message: "Coordinates must be an array of [longitude, latitude].",
        },
      },
    },
    availability: {
      type: Boolean,
      default: true, // Default to available
    },
  },

  { timestamps: true }
);

// Create a 2dsphere index for geospatial queries
driverSchema.index({ location: "2dsphere" });

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;
