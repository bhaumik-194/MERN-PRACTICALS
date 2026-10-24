const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message:
      statusCode === 500
        ? "Internal server error"
        : err.message || "Request failed",
  });
};

const notFoundMiddleware = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorMiddleware, notFoundMiddleware };