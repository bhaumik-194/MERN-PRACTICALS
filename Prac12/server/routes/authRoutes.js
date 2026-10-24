const express = require("express");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");

const {
  register,
  login,
  getMe,
  logout,
} = require("../controllers/authController");

const { authMiddleware } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts. Try again later." },
});

const emailValidation = body("email")
  .trim()
  .isEmail()
  .withMessage("Enter a valid email address")
  .normalizeEmail();

router.post(
  "/register",
  authLimiter,
  [
    body("name")
      .trim()
      .isLength({ min: 2, max: 80 })
      .withMessage("Name must be between 2 and 80 characters"),
    emailValidation,
    body("password")
      .isString()
      .isLength({ min: 8, max: 128 })
      .withMessage("Password must be between 8 and 128 characters"),
  ],
  validateRequest,
  register
);

router.post(
  "/login",
  authLimiter,
  [
    emailValidation,
    body("password")
      .isString()
      .notEmpty()
      .withMessage("Password is required"),
  ],
  validateRequest,
  login
);

router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logout);

module.exports = router;