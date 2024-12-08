// controllers/analyticsController.js
const Earnings = require("../models/Earnings"); // Import the Earnings model
const Ride = require("../models/ride"); // Import the Ride model

// Function to track total revenue
const getTotalRevenue = async (req, res) => {
  try {
    const revenue = await Earnings.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      success: true,
      totalRevenue: revenue.length > 0 ? revenue[0].totalRevenue : 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Function to track completed rides
const getCompletedRides = async (req, res) => {
  try {
    const completedRides = await Ride.countDocuments({ status: "completed" });

    res.status(200).json({
      success: true,
      completedRides,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Function to track total revenue and completed rides for chart
const getAnalyticsData = async (req, res) => {
  try {
    const revenue = await Earnings.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);

    const completedRides = await Ride.countDocuments({ status: "completed" });

    res.status(200).json({
      success: true,
      analytics: {
        totalRevenue: revenue.length > 0 ? revenue[0].totalRevenue : 0,
        completedRides,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getTotalRevenue,
  getCompletedRides,
  getAnalyticsData,
};
