// controllers/disputeController.js
const Dispute = require("../models/Dispute");
const User = require("../models/User");
const Driver = require("../models/Driver");

// Get all disputes
exports.getDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find().lean(); // Fetch all disputes as plain JavaScript objects

    for (const dispute of disputes) {
      if (dispute.driverId !== "") {
        // Fetch driver by ID
        const driver = await Driver.findOne({ _id: dispute.driverId });
        // Add driver to dispute object
        dispute.driver = driver;
      } else if (dispute.userId !== "") {
        // Fetch user by ID
        const user = await User.findOne({ _id: dispute.userId });
        // Add user to dispute object
        dispute.user = user;
      }
    }
    console.log(disputes);
    res.json({ disputes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching disputes" });
  }
};

// Create a dispute
exports.createDispute = (req, res) => {
  const { driverId, userId, issueDescription } = req.body;

  // Check if driverId and issueDescription are provided
  if (!issueDescription) {
    return res
      .status(400)
      .json({ message: "Driver ID and issue description are required" });
  }

  // Create a new dispute document
  const dispute = new Dispute({
    userId,
    driverId,
    issueDescription,
    status: "Pending", // Initially, the dispute is pending
  });
  console.log(dispute);
  // Save the dispute
  dispute
    .save()
    .then((newDispute) => {
      res.status(201).json({
        message: "Dispute created successfully",
        dispute: newDispute,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error creating dispute" });
    });
};

// Resolve a dispute
exports.resolveDispute = (req, res) => {
  const { disputeId, resolutionMessage } = req.body;

  if (!disputeId || !resolutionMessage) {
    return res
      .status(400)
      .json({ message: "Dispute ID and resolution message are required" });
  }

  Dispute.findByIdAndUpdate(
    disputeId,
    { status: "Resolved", resolutionMessage, updatedAt: Date.now() },
    { new: true }
  )
    .then((dispute) => {
      res.json({ message: "Dispute resolved successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error resolving dispute" });
    });
};
