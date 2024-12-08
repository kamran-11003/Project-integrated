const Fare = require("../models/Fare"); // Adjust the path to your model

// Get all fares with promotions
const getAllFares = async (req, res) => {
  try {
    const fares = await Fare.find(); // Fetch all fares from the database
    res.status(200).json(fares);
  } catch (error) {
    res.status(500).json({ message: "Error fetching fares", error });
  }
};

// Get a specific fare by ride type
const getFareByRideType = async (req, res) => {
  const { rideType } = req.params;
  try {
    const fare = await Fare.findOne({ rideType });
    if (!fare) {
      return res
        .status(404)
        .json({ message: "Fare not found for this ride type" });
    }
    res.status(200).json(fare);
  } catch (error) {
    res.status(500).json({ message: "Error fetching fare", error });
  }
};

module.exports = {
  getAllFares,
  getFareByRideType,
};
