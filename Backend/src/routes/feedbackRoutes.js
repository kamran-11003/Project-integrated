const express = require("express");
const {
  addFeedback,
  getFeedbacks,
} = require("../controllers/feedbackController");
const router = express.Router();

// Route to add feedback for a driver
router.post("/add", addFeedback);

// Route to get all feedbacks for a driver
router.get("/feedbacks/:driverId", getFeedbacks);

module.exports = router;
