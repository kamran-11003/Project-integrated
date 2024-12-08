const User = require("../models/User");

// Update user profile (including wallet balance update logic)
const updateProfile = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is in req.user from authentication middleware
  const updates = req.body;

  // Allowed fields to update
  const allowedUpdates = [
    "firstName",
    "lastName",
    "phone",
    "preferredPaymentMethod",
  ];
  const updateKeys = Object.keys(updates);

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update only allowed fields
    updateKeys.forEach((key) => {
      user[key] = updates[key];
    });

    // Save the updated user
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Wallet balance update (dedicated logic)
const updateWallet = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is in req.user
  const { amount } = req.body;

  if (typeof amount !== "number" || amount < 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update wallet balance
    user.wallet += amount;
    await user.save();

    res.status(200).json({ balance: user.wallet });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Fetch user profile
const getUser = async (req, res) => {
  const userId = req.user.id; // Assuming user ID is in req.user from authentication middleware

  try {
    // Find user by ID and exclude sensitive fields
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = { getUser, updateProfile, updateWallet };
