
const express = require("express");
const multer = require("multer");
const path = require("path");
const File = require("../models/File");

const router = express.Router();

// Configure where uploaded files are saved
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    },
});

// Allow common document and image types
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "text/plain",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, PNG, PDF, and TXT files are allowed."));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

// Upload a file and save its metadata
router.post("/upload", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Please select a file to upload.",
            });
        }

        const fileData = new File({
            originalName: req.file.originalname,
            fileName: req.file.filename,
            filePath: req.file.path,
            mimeType: req.file.mimetype,
            fileSize: req.file.size,
        });

        const savedFile = await fileData.save();

        res.status(201).json({
            message: "File uploaded and metadata saved successfully.",
            file: savedFile,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to save file metadata.",
        });
    }
});

// Retrieve all uploaded file metadata
router.get("/files", async (req, res) => {
    try {
        const files = await File.find().sort({ uploadedAt: -1 });
        res.json(files);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve files.",
        });
    }
});

module.exports = router;
