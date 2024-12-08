const express = require('express');
const router = express.Router();
const { getAllFares, getFareByRideType } = require('../controllers/fareController'); // Adjust path to your controller

// Route to get all fares
router.get('/fares', getAllFares);

// Route to get a fare by ride type
router.get('/fares/:rideType', getFareByRideType);

module.exports = router;
