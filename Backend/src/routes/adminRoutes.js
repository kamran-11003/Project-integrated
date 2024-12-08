const express = require("express");
const adminController = require("../controllers/adminController");
const router = express.Router();
const { authenticateToken, isAdmin } = require("../middleware/authMiddleware");

// Apply authentication and admin check middleware
router.use(authenticateToken); // First, authenticate the user
router.use(isAdmin); // Then, check if the user is an admin

// Routes for admin functionalities
router.get("/unapproved-drivers", adminController.getUnapprovedDrivers);
router.get(
  "/suspended-banned-drivers",
  adminController.getSuspendedBannedDrivers
);
router.get("/suspended-banned-users", adminController.getSuspendedBannedUsers);
router.put("/user/status", adminController.updateUserStatus);
router.put("/driver/status", adminController.updateDriverStatus);
router.put("/driver/approve", adminController.approveDriver);
router.put("/user/update", adminController.updateUser);
router.put("/driver/update", adminController.updateDriver);
router.delete("/user/delete", adminController.deleteUser);
router.delete("/driver/delete", adminController.deleteDriver);

// Fare and promotion management routes
router.put("/fare/update", adminController.updateFare);
router.post("/promotion/add", adminController.addPromotion);
router.delete("/promotion/remove", adminController.removePromotion);
router.put("/promotion/update", adminController.updatePromotion);

module.exports = router;
