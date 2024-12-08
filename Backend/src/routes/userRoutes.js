const express = require("express");
const {
  getUser,
  updateProfile,
  updateWallet,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware"); // Import the authentication middleware

const router = express.Router();

// Profile update route
router.put("/profile", authenticateToken, updateProfile);

// Wallet update route
router.post("/wallet", authenticateToken, updateWallet);
router.get("/profile", authenticateToken, getUser);

module.exports = router;
