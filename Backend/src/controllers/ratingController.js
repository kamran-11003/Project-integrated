const Rating = require("../models/Rating");
const mongoose = require("mongoose");

// Controller function to add a rating
const addRating = async (req, res) => {
  try {
    // Destructure the driverId and rating from the request body
    const { driverId, rating } = req.body;
    console.log(driverId, rating);
    // Validate rating (ensure it is between 1 and 5)
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5." });
    }

    // Check if driverId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(driverId)) {
      return res.status(400).json({ message: "Invalid driverId." });
    }

    // Create a new Rating instance
    const newRating = new Rating({
      driverId: new mongoose.Types.ObjectId(driverId), // Ensure driverId is an ObjectId
      rating,
      date: new Date(), // Set current date as the rating date
    });

    // Save the rating to the database
    await newRating.save();

    // Send response with the saved rating
    res
      .status(201)
      .json({ message: "Rating added successfully", rating: newRating });
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).json({ message: "Server error. Could not save rating." });
  }
};

// Controller function to get average rating for a driver
const getAverageRating = async (req, res) => {
  try {
    const { driverId } = req.params;

    // Check if driverId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(driverId)) {
      return res.status(400).json({ message: "Invalid driverId." });
    }

    // Fetch all ratings for the driver
    const ratings = await Rating.find({ driverId });
    const totalRatings = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = ratings.length ? totalRatings / ratings.length : 0;

    // Return the average rating
    res.status(200).json({ averageRating });
  } catch (error) {
    res.status(500).json({ message: "Error fetching rating", error });
  }
};

module.exports = { addRating, getAverageRating };
