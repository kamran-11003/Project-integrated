const express = require("express");
const router = express.Router();
const earningsController = require("../controllers/Earnings"); // Adjust the path as necessary

// Route to add earnings
router.post("/add", earningsController.addEarnings);

// Route to get earnings summary (daily, weekly, or monthly)
router.get("/summary", earningsController.getEarningsSummary);

module.exports = router;
