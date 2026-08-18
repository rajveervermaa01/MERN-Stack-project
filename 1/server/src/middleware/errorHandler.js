const ErrorResponse = require('../utils/ErrorResponse');

/**
 * Centralized Express Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error stack for developer debugging
  console.error(`[Error Middleware] ${err.stack || err.message}`);

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose Duplicate Key (11000)
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors || {})
      .map((val) => val.message || val)
      .join(', ') || err.message;
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

module.exports = errorHandler;
