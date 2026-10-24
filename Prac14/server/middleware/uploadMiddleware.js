const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const allowedTypes = {
  ".pdf": ["application/pdf"],
  ".doc": ["application/msword"],
  ".docx": [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ".xls": ["application/vnd.ms-excel"],
  ".xlsx": [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  ".ppt": ["application/vnd.ms-powerpoint"],
  ".pptx": [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
  ".txt": ["text/plain"],
  ".png": ["image/png"],
  ".jpg": ["image/jpeg"],
  ".jpeg": ["image/jpeg"],
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${extension}`);
  },
});

function fileFilter(req, file, cb) {
  const extension = path.extname(file.originalname).toLowerCase();
  const permittedMimes = allowedTypes[extension];

  if (!permittedMimes || !permittedMimes.includes(file.mimetype)) {
    return cb(
      new Error("Unsupported file type. Upload PDF, Office, TXT, or image files.")
    );
  }

  cb(null, true);
}

const maxFileSize =
  Math.max(1, Number(process.env.MAX_FILE_SIZE_MB) || 10) *
  1024 *
  1024;

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
    files: 1,
  },
});

module.exports = upload;