const User = require("../models/User");
const Driver = require("../models/Driver");
const Fare = require("../models/Fare");

// Get unapproved drivers
const getUnapprovedDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ approved: false });

    if (drivers.length === 0) {
      return res.status(404).json({ message: "No unapproved drivers found" });
    }

    res.status(200).json({ drivers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get suspended or banned drivers
const getSuspendedBannedDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({
      suspensionStatus: { $in: ["suspended", "banned"] },
    });

    if (drivers.length === 0) {
      return res
        .status(404)
        .json({ message: "No suspended or banned drivers found" });
    }
    console.log(drivers);
    res.status(200).json({ drivers });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get suspended or banned users
const getSuspendedBannedUsers = async (req, res) => {
  try {
    const users = await User.find({
      suspensionStatus: { $in: ["suspended", "banned"] },
    });

    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No suspended or banned users found" });
    }
    console.log(users);
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;

  if (!["active", "suspended", "banned"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { suspensionStatus: status },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: `User status updated to ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a user account
const updateUser = async (req, res) => {
  const { userId, updates } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Suspend, unsuspend, or ban a driver
const updateDriverStatus = async (req, res) => {
  const { driverId, status } = req.body;

  if (!["active", "suspended", "banned"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { suspensionStatus: status },
      { new: true }
    );
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res
      .status(200)
      .json({ message: `Driver status updated to ${status}`, driver });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Approve a driver
const approveDriver = async (req, res) => {
  const { driverId } = req.body;

  try {
    const driver = await Driver.findByIdAndUpdate(
      driverId,
      { approved: true },
      { new: true }
    );
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json({ message: "Driver approved successfully", driver });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a driver account
const updateDriver = async (req, res) => {
  const { driverId, updates } = req.body;

  try {
    const driver = await Driver.findByIdAndUpdate(driverId, updates, {
      new: true,
    });
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json({ message: "Driver updated successfully", driver });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a driver account
const deleteDriver = async (req, res) => {
  const { driverId } = req.body;

  try {
    const driver = await Driver.findByIdAndDelete(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Fare for a particular ride type
const updateFare = async (req, res) => {
  const { rideType, fareMultiplier } = req.body;

  if (
    ![
      "Ride AC",
      "Ride Mini",
      "Motoride",
      "Horse",
      "Spiderman",
      "Superman",
    ].includes(rideType)
  ) {
    return res.status(400).json({ message: "Invalid ride type" });
  }

  try {
    const fare = await Fare.findOneAndUpdate(
      { rideType },
      { fareMultiplier },
      { new: true, upsert: true } // If no fare is found, it will create one
    );

    res.status(200).json({ message: "Fare updated successfully", fare });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Add a promotion to a ride type
const addPromotion = async (req, res) => {
  const { rideType, promotionCode, discountPercentage, validUntil } = req.body;

  if (
    ![
      "Ride AC",
      "Ride Mini",
      "Motoride",
      "Horse",
      "Spiderman",
      "Superman",
    ].includes(rideType)
  ) {
    return res.status(400).json({ message: "Invalid ride type" });
  }

  if (discountPercentage < 0 || discountPercentage > 100) {
    return res.status(400).json({ message: "Invalid discount percentage" });
  }

  try {
    const fare = await Fare.findOne({ rideType });

    if (!fare) {
      return res
        .status(404)
        .json({ message: "Fare not found for this ride type" });
    }

    fare.promotions.push({
      promotionCode,
      discountPercentage,
      validUntil,
    });

    await fare.save();

    res.status(200).json({ message: "Promotion added successfully", fare });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Remove a promotion from a ride type
const removePromotion = async (req, res) => {
  const { rideType, promotionCode } = req.body;

  if (
    ![
      "Ride AC",
      "Ride Mini",
      "Motoride",
      "Horse",
      "Spiderman",
      "Superman",
    ].includes(rideType)
  ) {
    return res.status(400).json({ message: "Invalid ride type" });
  }

  try {
    const fare = await Fare.findOne({ rideType });

    if (!fare) {
      return res
        .status(404)
        .json({ message: "Fare not found for this ride type" });
    }

    const promotionIndex = fare.promotions.findIndex(
      (promotion) => promotion.promotionCode === promotionCode
    );

    if (promotionIndex === -1) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    fare.promotions.splice(promotionIndex, 1); // Remove the promotion

    await fare.save();

    res.status(200).json({ message: "Promotion removed successfully", fare });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

// Update an existing promotion (e.g., change discount or expiration date)
const updatePromotion = async (req, res) => {
  const { rideType, promotionCode, discountPercentage, validUntil } = req.body;

  if (
    ![
      "Ride AC",
      "Ride Mini",
      "Motoride",
      "Horse",
      "Spiderman",
      "Superman",
    ].includes(rideType)
  ) {
    return res.status(400).json({ message: "Invalid ride type" });
  }

  try {
    const fare = await Fare.findOne({ rideType });

    if (!fare) {
      return res
        .status(404)
        .json({ message: "Fare not found for this ride type" });
    }

    const promotion = fare.promotions.find(
      (promo) => promo.promotionCode === promotionCode
    );

    if (!promotion) {
      return res.status(404).json({ message: "Promotion not found" });
    }

    if (discountPercentage !== undefined) {
      promotion.discountPercentage = discountPercentage;
    }

    if (validUntil !== undefined) {
      promotion.validUntil = validUntil;
    }

    await fare.save();

    res.status(200).json({ message: "Promotion updated successfully", fare });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
};

module.exports = {
  getUnapprovedDrivers,
  getSuspendedBannedDrivers,
  getSuspendedBannedUsers,
  updateUserStatus,
  updateUser,
  deleteUser,
  updateDriverStatus,
  approveDriver,
  updateDriver,
  deleteDriver,
  updateFare,
  addPromotion,
  removePromotion,
  updatePromotion,
};
