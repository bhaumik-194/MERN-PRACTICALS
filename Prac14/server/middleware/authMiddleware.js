const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Authentication required");
  }

  const token = header.slice(7);

  if (!process.env.JWT_SECRET) {
    res.status(500);
    throw new Error("Authentication is not configured");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.status(401);
    throw new Error("Invalid or expired token");
  }

  const user = await User.findById(decoded.id).select("_id name email role");

  if (!user) {
    res.status(401);
    throw new Error("User account not found");
  }

  req.user = user;
  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    res.status(403);
    return next(new Error("You do not have permission to perform this action"));
  }

  next();
};

module.exports = { protect, authorize };