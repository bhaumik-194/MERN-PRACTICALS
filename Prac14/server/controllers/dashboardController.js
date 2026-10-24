const Document = require("../models/Document");
const Activity = require("../models/Activity");
const asyncHandler = require("../utils/asyncHandler");

const getDashboard = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "admin" ? {} : { owner: req.user._id };

  const [totalDocuments, storageResult, categoryResult, recentDocuments, recentActivities] =
    await Promise.all([
      Document.countDocuments(filter),
      Document.aggregate([
        { $match: filter.owner ? { owner: filter.owner } : {} },
        { $group: { _id: null, totalBytes: { $sum: "$size" } } },
      ]),
      Document.aggregate([
        { $match: filter.owner ? { owner: filter.owner } : {} },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Document.find(filter)
        .populate("owner", "name email")
        .sort({ createdAt: -1 })
        .limit(5),
      Activity.find(
        req.user.role === "admin" ? {} : { user: req.user._id }
      )
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

  res.json({
    success: true,
    stats: {
      totalDocuments,
      totalStorageBytes: storageResult[0]?.totalBytes || 0,
      categories: categoryResult,
    },
    recentDocuments,
    recentActivities,
  });
});

module.exports = { getDashboard };