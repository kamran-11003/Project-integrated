const Earnings = require("../models/Earnings"); // Import Earnings model
const mongoose = require("mongoose");

// Add earnings
const addEarnings = async (req, res) => {
  try {
    const { driverId, amount } = req.body;

    // Validate that both fields are provided
    if (!driverId || !amount) {
      return res
        .status(400)
        .json({ message: "Driver ID and amount are required" });
    }

    // Create a new earnings entry
    const earnings = new Earnings({
      driverId,
      amount,
      date: new Date(),
    });

    // Save to the database
    const savedEarnings = await earnings.save();

    return res
      .status(201)
      .json({ message: "Earnings added successfully", data: savedEarnings });
  } catch (error) {
    console.error(error); // Log the error for server-side debugging
    return res
      .status(500)
      .json({
        message: "Server error while adding earnings",
        error: error.message,
      });
  }
};

// Get Earnings Summary - Daily, Weekly, or Monthly
const getEarningsSummary = async (req, res) => {
  try {
    const { driverId, period } = req.query;

    if (!driverId || !period) {
      return res
        .status(400)
        .json({
          message: "Driver ID and period (daily, weekly, monthly) are required",
        });
    }

    // Define date range based on period
    let startDate;
    const endDate = new Date();
    console.log(endDate);
    switch (period) {
      case "daily":
        startDate = new Date(endDate.setDate(endDate.getDate() - 1));
        break;
      case "weekly":
        startDate = new Date(endDate.setDate(endDate.getDate() - 7));
        break;
      case "monthly":
        startDate = new Date(endDate.setMonth(endDate.getMonth() - 1));
        break;
      default:
        return res
          .status(400)
          .json({
            message: 'Invalid period. Use "daily", "weekly", or "monthly".',
          });
    }
    const earn = await Earnings.find({ driverId });
    // Use 'new' with ObjectId to correctly create an ObjectId
    const date = new Date();
    const earnings = earn.filter((earn) => {
      const earningDate = new Date(earn.date);
      return earningDate >= startDate && earningDate <= date;
    });
    console.log(earnings);
    if (earnings.length === 0) {
      return res
        .status(404)
        .json({ message: "No earnings found for the given period" });
    }

    // Calculate the total earnings within the date range
    const totalEarnings = earnings.reduce(
      (total, earning) => total + earning.amount,
      0
    );

    return res.status(200).json({
      message: "Earnings retrieved successfully",
      totalEarnings,
      data: earnings,
    });
  } catch (error) {
    console.error("Error fetching earnings summary:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching earnings summary" });
  }
};

module.exports = {
  addEarnings,
  getEarningsSummary,
};
