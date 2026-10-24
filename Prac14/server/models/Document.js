const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    storedName: {
      type: String,
      required: true,
      unique: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
      min: 1,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    category: {
      type: String,
      trim: true,
      maxlength: 60,
      default: "General",
    },
    tags: {
      type: [String],
      default: [],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

documentSchema.index({ originalName: "text", description: "text" });
documentSchema.index({ owner: 1, createdAt: -1 });

module.exports = mongoose.model("Document", documentSchema);