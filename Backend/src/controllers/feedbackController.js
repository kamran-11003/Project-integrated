const Feedback = require("../models/Feedback");
const mongoose = require("mongoose");

// Controller function to add feedback for a driver
const addFeedback = async (req, res) => {
  try {
    const { driverId, feedback } = req.body;
    console.log(driverId, feedback);
    // Validate driverId (check if it's a valid ObjectId)
    if (!mongoose.Types.ObjectId.isValid(driverId)) {
      return res.status(400).json({ message: "Invalid driverId." });
    }

    // Check if the driver exists (optional but recommended)
    // You can add this check if you have a Driver model
    // const driverExists = await Driver.findById(driverId);
    // if (!driverExists) {
    //   return res.status(404).json({ message: 'Driver not found.' });
    // }

    // Create a new Feedback instance

    const newFeedback = new Feedback({
      driverId: new mongoose.Types.ObjectId(driverId), // Ensure driverId is an ObjectId
      feedback,
      date: new Date(), // Set current date as the feedback date
    });

    // Save the feedback to the database
    await newFeedback.save();

    // Send response with the saved feedback
    res
      .status(201)
      .json({ message: "Feedback added successfully", feedback: newFeedback });
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).json({ message: "Server error. Could not save feedback." });
  }
};

// Controller function to get all feedbacks for a driver
const getFeedbacks = async (req, res) => {
  try {
    const { driverId } = req.params;

    // Validate driverId (check if it's a valid ObjectId)
    if (!mongoose.Types.ObjectId.isValid(driverId)) {
      return res.status(400).json({ message: "Invalid driverId." });
    }

    // Fetch all feedbacks for the given driver
    const feedbacks = await Feedback.find({ driverId })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order (most recent first)
      .limit(2); // Limit to the top 2 feedbacks

    if (feedbacks.length === 0) {
      return res
        .status(404)
        .json({ message: "No feedbacks found for this driver." });
    }

    // Return the feedbacks
    res.status(200).json({ feedbacks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching feedbacks", error });
  }
};

module.exports = { addFeedback, getFeedbacks };
