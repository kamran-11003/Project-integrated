const Driver = require("../models/Driver.js");

const isValidCoordinates = (longitude, latitude) => {
  return (
    typeof longitude === "number" &&
    typeof latitude === "number" &&
    longitude >= -180 &&
    longitude <= 180 &&
    latitude >= -90 &&
    latitude <= 90
  );
};

// Update the driver's location based on their ID
const updateDriverLocation = async (req, res) => {
  const { driverId } = req.params;
  const { longitude, latitude } = req.body;

  try {
    if (!isValidCoordinates(longitude, latitude)) {
      return res
        .status(400)
        .json({ message: "Invalid longitude or latitude values" });
    }

    const updatedDriver = await Driver.findByIdAndUpdate(
      driverId,
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      { new: true }
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res
      .status(200)
      .json({
        message: "Driver location updated successfully",
        driver: updatedDriver,
      });
  } catch (error) {
    console.error("Error updating driver location:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Find nearby drivers within a specified radius
const findNearbyDrivers = async (req, res) => {
  const { longitude, latitude, radius = 10 } = req.query;

  try {
    const parsedLongitude = parseFloat(longitude);
    const parsedLatitude = parseFloat(latitude);
    const parsedRadius = parseFloat(radius);

    if (
      !isValidCoordinates(parsedLongitude, parsedLatitude) ||
      isNaN(parsedRadius) ||
      parsedRadius <= 0
    ) {
      return res.status(400).json({ message: "Invalid query parameters" });
    }

    const drivers = await Driver.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [parsedLongitude, parsedLatitude],
            parsedRadius / 6378.1,
          ],
        },
      },
    });

    res.status(200).json({ drivers });
  } catch (error) {
    console.error("Error finding nearby drivers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update driver details based on driver ID
const updateDriver = async (req, res) => {
  const { driverId } = req.params;
  const updateData = req.body;

  try {
    console.log("Update request data:", updateData);

    const updatedDriver = await Driver.findByIdAndUpdate(driverId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res
      .status(200)
      .json({ message: "Driver updated successfully", driver: updatedDriver });
  } catch (error) {
    console.error("Error updating driver:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const toggleAvailability = async (req, res) => {
  console.log(req.params);
  const { driverId } = req.params; // Assuming driverId is passed as a URL parameter
  console.log(driverId);
  try {
    // Find the driver by ID
    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Toggle the availability status
    driver.availability = !driver.availability;

    // Save the updated driver
    await driver.save();

    // Respond with the updated driver
    res.status(200).json({
      message: `Driver availability toggled successfully`,
      availability: driver.availability,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// Get the profile of a driver by their ID
const getProfile = async (req, res) => {
  const { driverId } = req.params;

  try {
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res
      .status(200)
      .json({ message: "Driver profile retrieved successfully", driver });
  } catch (error) {
    console.error("Error retrieving driver profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateDriverLocation,
  findNearbyDrivers,
  updateDriver,
  getProfile,
  toggleAvailability,
};
