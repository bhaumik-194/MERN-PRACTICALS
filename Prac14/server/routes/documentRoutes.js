const express = require("express");
const {
  uploadDocument,
  getDocuments,
  getDocument,
  downloadDocument,
  renameDocument,
  deleteDocument,
} = require("../controllers/documentController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getDocuments)
  .post(upload.single("file"), uploadDocument);

router.get("/:id/download", downloadDocument);
router.route("/:id")
  .get(getDocument)
  .patch(renameDocument)
  .delete(deleteDocument);

module.exports = router;