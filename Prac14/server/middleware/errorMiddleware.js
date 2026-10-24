function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  let statusCode =
    err.statusCode ||
    (res.statusCode >= 400 ? res.statusCode : 500);

  if (err.name === "ValidationError" || err.name === "CastError") {
    statusCode = 400;
  }

  if (err.code === 11000) {
    statusCode = 409;
  }

  if (err.name === "MulterError") {
    statusCode = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
  }

  if (err.message?.startsWith("Unsupported file type")) {
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500
        ? "Internal server error"
        : err.message || "Request failed",
  });

  if (statusCode >= 500) {
    console.error(err);
  }
}

module.exports = { notFound, errorHandler };