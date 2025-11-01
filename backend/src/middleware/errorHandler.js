import { config } from "../config/env.js";

/**
 * Global error handler middleware
 * Catches all errors and returns consistent JSON response format
 * @param {Error} err - Error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error("Error:", {
    message: err.message,
    stack: config.nodeEnv === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Default error status and message
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal server error";

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation error";
  } else if (
    err.name === "UnauthorizedError" ||
    err.name === "JsonWebTokenError"
  ) {
    statusCode = 401;
    message = "Unauthorized access";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  } else if (err.code === "P2002") {
    // Prisma unique constraint error
    statusCode = 409;
    message = "Resource already exists";
  } else if (err.code === "P2025") {
    // Prisma record not found error
    statusCode = 404;
    message = "Resource not found";
  } else if (err.name === "PrismaClientKnownRequestError") {
    statusCode = 400;
    message = "Database operation failed";
  }

  // Construct consistent error response
  const errorResponse = {
    success: false,
    message,
  };

  // Add additional details in development mode
  if (config.nodeEnv === "development") {
    errorResponse.error = {
      name: err.name,
      stack: err.stack,
      code: err.code,
    };
  }

  // Add validation errors if present
  if (err.errors && Array.isArray(err.errors)) {
    errorResponse.errors = err.errors;
  }

  return res.status(statusCode).json(errorResponse);
};

/**
 * 404 Not Found handler
 * Catches all undefined routes
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Express middleware function
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}
