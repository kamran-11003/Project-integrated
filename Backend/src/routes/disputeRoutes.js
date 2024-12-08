// routes/disputeRoutes.js

const express = require('express');
const { getDisputes, createDispute,resolveDispute } = require('../controllers/disputeController');
const router = express.Router();
const {authenticateToken}=require('../middleware/authMiddleware');
// Get all disputes
router.get('/admin/disputes', getDisputes);

// Resolve a dispute
router.put('/admin/dispute/resolve', resolveDispute);
//create a route
router.post('/dispute', authenticateToken, createDispute);

module.exports = router;
