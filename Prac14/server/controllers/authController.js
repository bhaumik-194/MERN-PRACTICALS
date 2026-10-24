const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

function createToken(user) {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    res.status(400);
    throw new Error("Name, email, and password are required");
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (cleanName.length < 2 || cleanName.length > 60) {
    res.status(400);
    throw new Error("Name must be between 2 and 60 characters");
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
    cleanEmail.length > 254
  ) {
    res.status(400);
    throw new Error("Enter a valid email address");
  }

  if (password.length < 8 || password.length > 72) {
    res.status(400);
    throw new Error("Password must be between 8 and 72 characters");
  }

  const existingUser = await User.findOne({ email: cleanEmail });

  if (existingUser) {
    res.status(409);
    throw new Error("An account with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  // Public registration must never accept a role from the request.
  const user = await User.create({
    name: cleanName,
    email: cleanEmail,
    password: hashedPassword,
    role: "user",
  });

  res.status(201).json({
    success: true,
    message: "Registration successful",
    token: createToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+password");

  const validPassword =
    user && (await bcrypt.compare(password, user.password));

  if (!validPassword) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    token: createToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

module.exports = { register, login, getMe };