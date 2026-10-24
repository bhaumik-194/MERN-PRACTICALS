
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    originalName: {
        type: String,
        required: true,
    },
    fileName: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("File", fileSchema);
