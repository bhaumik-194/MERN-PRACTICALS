const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 160,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 50000,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
  },
  { timestamps: true }
);

blogSchema.index({ status: 1, createdAt: -1 });
blogSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model("Blog", blogSchema);