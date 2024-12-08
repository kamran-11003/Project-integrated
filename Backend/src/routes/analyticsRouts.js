// routes/analyticsRoutes.js
const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyaticsController");

// Route for tracking total revenue
router.get("/total-revenue", analyticsController.getTotalRevenue);

// Route for tracking completed rides
router.get("/completed-rides", analyticsController.getCompletedRides);

// Route for tracking both revenue and completed rides (for charts)
router.get("/analytics-data", analyticsController.getAnalyticsData);

module.exports = router;
