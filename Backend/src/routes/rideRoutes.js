const express = require("express");
const router = express.Router();
const rideController = require("../controllers/rideController");

// Get rides by user ID
router.get("/rides/user/:userId", rideController.getRidesByUserId);

// Get rides by driver ID
router.get("/rides/driver/:driverId", rideController.getRidesByDriverId);

module.exports = router;
