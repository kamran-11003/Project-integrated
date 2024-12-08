const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating'); 
const { addRating,getAverageRating } = require('../controllers/ratingController'); 

router.post('/rate', addRating);
router.get('/average-rating/:driverId', getAverageRating);

module.exports = router;

