const User = require("../models/User"); // Import the User model
const Driver = require("../models/Driver"); // Import the Driver model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const Admin = require("../models/Admin"); // Import the Admin model

// Configure multer storage (save files locally or in a cloud)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use unique filenames
  },
});

const upload = multer({ storage: storage });

// Middleware for file uploads
exports.uploadFiles = upload.fields([
  { name: "licenseImage", maxCount: 1 },
  { name: "profileImage", maxCount: 1 },
]);

// Register a new user
exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: "user", // Add role to the payload
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Set token expiration
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Register a new driver
exports.registerDriver = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    idNumber,
    licenseNumber,
    vehicleMake,
    vehicleModel,
    vehicleYear,
    plateNumber,
  } = req.body;
  const licenseImage = req.files?.licenseImage
    ? req.files.licenseImage[0].path
    : null;
  const profileImage = req.files?.profileImage
    ? req.files.profileImage[0].path
    : null;
  try {
    // Check if email already exists
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver)
      return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new driver
    const driver = new Driver({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      idNumber,
      licenseNumber,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      plateNumber,
      licenseImage, // Store the file path or URL here
      profileImage, // Store the file path or URL here
      location: {
        type: "Point",
        coordinates: [0, 0], // Default coordinates
      },
    });

    await driver.save();
    res.status(201).json({ message: "Driver registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login a driver
exports.loginDriver = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if driver exists
    const driver = await Driver.findOne({ email });
    if (!driver)
      return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      {
        id: driver._id,
        role: "driver", // Add role to the payload
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Set token expiration
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// Login an admin
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin", // Add role to the payload
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Set token expiration
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
