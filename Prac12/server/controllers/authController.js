const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
});

const createToken = (userId) =>
  jwt.sign({ sub: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: "1d",
    algorithm: "HS256",
  });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "user",
  });

  const token = createToken(user._id);
  res.cookie("token", token, cookieOptions());

  res.status(201).json({
    message: "Registration successful",
    user: publicUser(user),
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = createToken(user._id);
  res.cookie("token", token, cookieOptions());

  res.status(200).json({
    message: "Login successful",
    user: publicUser(user),
  });
});

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ user: publicUser(req.user) });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = { register, login, getMe, logout };