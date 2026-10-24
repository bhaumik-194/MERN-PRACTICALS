const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      default: null,
    },
    action: {
      type: String,
      enum: [
        "UPLOAD",
        "DOWNLOAD",
        "RENAME",
        "DELETE",
      ],
      required: true,
    },
    details: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
  },
  { timestamps: true }
);

activitySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Activity", activitySchema);