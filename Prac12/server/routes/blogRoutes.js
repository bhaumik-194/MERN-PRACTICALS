const express = require("express");
const { body } = require("express-validator");

const {
  getPublishedBlogs,
  getMyBlogs,
  getAllBlogsAdmin,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");

const {
  authMiddleware,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const validateRequest = require("../middleware/validateRequest");

const router = express.Router();

const blogValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 160 })
    .withMessage("Title must be between 3 and 160 characters"),
  body("content")
    .optional()
    .trim()
    .isLength({ min: 10, max: 50000 })
    .withMessage("Content must be between 10 and 50000 characters"),
  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be draft or published"),
];

const createValidation = [
  body("title")
    .trim()
    .isLength({ min: 3, max: 160 })
    .withMessage("Title must be between 3 and 160 characters"),
  body("content")
    .trim()
    .isLength({ min: 10, max: 50000 })
    .withMessage("Content must be between 10 and 50000 characters"),
  body("status")
    .optional()
    .isIn(["draft", "published"])
    .withMessage("Status must be draft or published"),
];

// Public: published blogs only
router.get("/", getPublishedBlogs);

// Private: current user's blogs, including drafts
router.get("/mine", authMiddleware, getMyBlogs);

// Admin: all blogs, including drafts from all authors
router.get(
  "/admin/all",
  authMiddleware,
  authorizeRoles("admin"),
  getAllBlogsAdmin
);

// Keep these routes after /mine and /admin/all
router.get("/:id", getBlogById);

router.post(
  "/",
  authMiddleware,
  createValidation,
  validateRequest,
  createBlog
);

router.put(
  "/:id",
  authMiddleware,
  blogValidation,
  validateRequest,
  updateBlog
);

router.delete("/:id", authMiddleware, deleteBlog);

module.exports = router;