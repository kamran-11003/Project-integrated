const jwt = require("jsonwebtoken");

// Middleware to authenticate token
exports.authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Bearer token

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user data to the request
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Function to check if user is an admin
exports.isAdmin = (req, res, next) => {
  const { role } = req.user; // Access the user from the request

  if (role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next(); // Proceed if the user is an admin
};
