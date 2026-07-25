const ApiError = require('../utils/ApiError');

// 404 handler for unmatched routes.
function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// Centralized error handler. Any error passed to next(err) lands here.
function errorMiddleware(err, req, res, next) {
  let { statusCode, message, details } = err;

  if (!statusCode) {
    statusCode = 500;
    message = message || 'Internal server error';
  }

  // Prisma known error codes -> friendlier messages
  if (err.code === 'P2002') {
    statusCode = 409;
    message = `Duplicate value for field: ${err.meta?.target || 'unknown'}`;
  }
  if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Record not found';
  }

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(process.env.NODE_ENV !== 'production' && statusCode === 500
      ? { stack: err.stack }
      : {}),
  });
}

module.exports = { notFoundHandler, errorMiddleware };
