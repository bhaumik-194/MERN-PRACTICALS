const mongoose = require("mongoose");
const Blog = require("../models/Blog");
const asyncHandler = require("../utils/asyncHandler");

const isAdmin = (user) => user.role === "admin";

const canManage = (user, blog) =>
  isAdmin(user) || blog.author.toString() === user._id.toString();

const getPublishedBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ status: "published" })
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({ blogs });
});

const getMyBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ author: req.user._id })
    .populate("author", "name")
    .sort({ updatedAt: -1 })
    .lean();

  res.status(200).json({ blogs });
});

const getAllBlogsAdmin = asyncHandler(async (req, res) => {
  const blogs = await Blog.find()
    .populate("author", "name email")
    .sort({ updatedAt: -1 })
    .lean();

  res.status(200).json({ blogs });
});

const getBlogById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }

  const blog = await Blog.findById(req.params.id).populate("author", "name");

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  const ownerId = blog.author._id.toString();
  const isOwner = ownerId === req.user?._id.toString();

  if (blog.status !== "published" && !isOwner && !isAdmin(req.user || {})) {
    return res.status(404).json({ message: "Blog not found" });
  }

  res.status(200).json({ blog });
});

const createBlog = asyncHandler(async (req, res) => {
  const { title, content, status = "draft" } = req.body;

  const blog = await Blog.create({
    title,
    content,
    status,
    author: req.user._id,
  });

  await blog.populate("author", "name");

  res.status(201).json({
    message: "Blog created successfully",
    blog,
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  if (!canManage(req.user, blog)) {
    return res.status(403).json({
      message: "You can only edit your own blogs",
    });
  }

  const { title, content, status } = req.body;

  if (title !== undefined) blog.title = title;
  if (content !== undefined) blog.content = content;
  if (status !== undefined) blog.status = status;

  await blog.save();
  await blog.populate("author", "name");

  res.status(200).json({
    message: "Blog updated successfully",
    blog,
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }

  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  if (!canManage(req.user, blog)) {
    return res.status(403).json({
      message: "You can only delete your own blogs",
    });
  }

  await blog.deleteOne();

  res.status(200).json({ message: "Blog deleted successfully" });
});

module.exports = {
  getPublishedBlogs,
  getMyBlogs,
  getAllBlogsAdmin,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};