const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Use JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// Protect routes
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch user from DB
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // attach user object to request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin-only middleware
const admin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

module.exports = { protect, admin };
