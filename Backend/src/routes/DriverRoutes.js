const express = require('express');
const router = express.Router();
const { 
  updateDriverLocation, 
  findNearbyDrivers, 
  updateDriver, 
  getProfile,
  toggleAvailability,
} = require('../controllers/DriverController');
// Route to update the driver's location by driver ID
router.put('/driver/:driverId/location', updateDriverLocation);

// Route to find nearby drivers
router.get('/driver/nearby', findNearbyDrivers);

// Route to update the driver's details
router.put('/driver/:driverId', updateDriver);

// Get driver profile
router.get('/driver/:driverId', getProfile);

// Toggle driver availability
router.put('/drivers/:driverId/toggle-availability', toggleAvailability);

module.exports = router;
