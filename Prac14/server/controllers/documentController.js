const fs = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");
const Document = require("../models/Document");
const Activity = require("../models/Activity");
const asyncHandler = require("../utils/asyncHandler");

const uploadDirectory = path.resolve(__dirname, "../uploads");

function canAccessDocument(document, user) {
  return (
    user.role === "admin" ||
    document.owner.toString() === user._id.toString()
  );
}

async function logActivity(userId, documentId, action, details = "") {
  try {
    await Activity.create({
      user: userId,
      document: documentId || null,
      action,
      details,
    });
  } catch (error) {
    // Do not silently ignore activity-log failures in server logs.
    console.error("Activity logging failed:", error.message);
  }
}

const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Select a file to upload");
  }

  const description =
    typeof req.body.description === "string"
      ? req.body.description.trim()
      : "";

  const category =
    typeof req.body.category === "string" && req.body.category.trim()
      ? req.body.category.trim().slice(0, 60)
      : "General";

  if (description.length > 1000) {
    await fs.unlink(req.file.path).catch(() => {});
    res.status(400);
    throw new Error("Description cannot exceed 1000 characters");
  }

  let tags = [];

  if (typeof req.body.tags === "string") {
    tags = req.body.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 10)
      .map((tag) => tag.slice(0, 30));
  }

  let document;

  try {
    document = await Document.create({
      originalName: path.basename(req.file.originalname).slice(0, 255),
      storedName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      description,
      category,
      tags,
      owner: req.user._id,
    });
  } catch (error) {
    await fs.unlink(req.file.path).catch(() => {});
    throw error;
  }

  await logActivity(
    req.user._id,
    document._id,
    "UPLOAD",
    `Uploaded ${document.originalName}`
  );

  res.status(201).json({
    success: true,
    message: "Document uploaded successfully",
    document,
  });
});

const getDocuments = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(
    50,
    Math.max(1, parseInt(req.query.limit, 10) || 10)
  );

  const filter = {};

  if (req.user.role !== "admin") {
    filter.owner = req.user._id;
  } else if (req.query.owner && mongoose.isValidObjectId(req.query.owner)) {
    filter.owner = req.query.owner;
  }

  if (req.query.category) {
    filter.category = req.query.category.toString().slice(0, 60);
  }

  if (req.query.search) {
    const search = req.query.search.toString().trim().slice(0, 100);

    if (search) {
      filter.$or = [
        { originalName: { $regex: escapeRegex(search), $options: "i" } },
        { description: { $regex: escapeRegex(search), $options: "i" } },
        { tags: { $regex: escapeRegex(search), $options: "i" } },
      ];
    }
  }

  const [documents, total] = await Promise.all([
    Document.find(filter)
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Document.countDocuments(filter),
  ]);

  res.json({
    success: true,
    documents,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function findAccessibleDocument(id, user) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error("Invalid document ID");
    error.statusCode = 400;
    throw error;
  }

  const document = await Document.findById(id);

  if (!document || !canAccessDocument(document, user)) {
    const error = new Error("Document not found");
    error.statusCode = 404;
    throw error;
  }

  return document;
}

const getDocument = asyncHandler(async (req, res) => {
  const document = await findAccessibleDocument(req.params.id, req.user);

  res.json({ success: true, document });
});

const downloadDocument = asyncHandler(async (req, res) => {
  const document = await findAccessibleDocument(req.params.id, req.user);

  const filePath = path.resolve(uploadDirectory, document.storedName);

  if (path.dirname(filePath) !== uploadDirectory) {
    res.status(400);
    throw new Error("Invalid stored file path");
  }

  try {
    await fs.access(filePath);
  } catch {
    res.status(404);
    throw new Error("File is missing from storage");
  }

  await logActivity(
    req.user._id,
    document._id,
    "DOWNLOAD",
    `Downloaded ${document.originalName}`
  );

  res.download(filePath, document.originalName);
});

const renameDocument = asyncHandler(async (req, res) => {
  const document = await findAccessibleDocument(req.params.id, req.user);
  const { originalName, description, category } = req.body;

  if (originalName !== undefined) {
    if (
      typeof originalName !== "string" ||
      !originalName.trim() ||
      originalName.trim().length > 255
    ) {
      res.status(400);
      throw new Error("Filename must be between 1 and 255 characters");
    }

    // Keep the existing extension to avoid misleading file types.
    const oldExtension = path.extname(document.originalName);
    const newName = path.basename(originalName.trim());

    if (
      path.extname(newName).toLowerCase() !== oldExtension.toLowerCase()
    ) {
      res.status(400);
      throw new Error("The original file extension cannot be changed");
    }

    document.originalName = newName;
  }

  if (description !== undefined) {
    if (
      typeof description !== "string" ||
      description.trim().length > 1000
    ) {
      res.status(400);
      throw new Error("Description cannot exceed 1000 characters");
    }

    document.description = description.trim();
  }

  if (category !== undefined) {
    if (
      typeof category !== "string" ||
      !category.trim() ||
      category.trim().length > 60
    ) {
      res.status(400);
      throw new Error("Category must be between 1 and 60 characters");
    }

    document.category = category.trim();
  }

  await document.save();

  await logActivity(
    req.user._id,
    document._id,
    "RENAME",
    `Updated ${document.originalName}`
  );

  res.json({
    success: true,
    message: "Document updated successfully",
    document,
  });
});

const deleteDocument = asyncHandler(async (req, res) => {
  const document = await findAccessibleDocument(req.params.id, req.user);

  const filePath = path.resolve(uploadDirectory, document.storedName);

  if (path.dirname(filePath) !== uploadDirectory) {
    res.status(400);
    throw new Error("Invalid stored file path");
  }

  // Delete metadata only after file removal succeeds or the file is absent.
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      res.status(500);
      throw new Error("Unable to delete file from storage");
    }
  }

  await document.deleteOne();

  await logActivity(
    req.user._id,
    document._id,
    "DELETE",
    `Deleted ${document.originalName}`
  );

  res.json({
    success: true,
    message: "Document deleted successfully",
  });
});

module.exports = {
  uploadDocument,
  getDocuments,
  getDocument,
  downloadDocument,
  renameDocument,
  deleteDocument,
};