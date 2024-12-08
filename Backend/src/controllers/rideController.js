const Ride = require("../models/ride"); // Assuming the Ride schema is in the models folder

/**
 * Get rides by user ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRidesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const rides = await Ride.find({ userId }).sort({ createdAt: -1 }); // Sort by newest first
    if (!rides.length) {
      return res
        .status(404)
        .json({ message: "No rides found for the given user ID." });
    }

    res.status(200).json(rides);
  } catch (error) {
    console.error("Error fetching rides by user ID:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

/**
 * Get rides by driver ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRidesByDriverId = async (req, res) => {
  try {
    const { driverId } = req.params;

    const rides = await Ride.find({ driverId }).sort({ createdAt: -1 }); // Sort by newest first

    if (!rides.length) {
      return res
        .status(404)
        .json({ message: "No rides found for the given driver ID." });
    }

    res.status(200).json(rides);
  } catch (error) {
    console.error("Error fetching rides by driver ID:", error);
    res.status(500).json({ message: "Internal server error.", error });
  }
};

module.exports = {
  getRidesByUserId,
  getRidesByDriverId,
};
