import { config } from "../config/env.js";

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", {
    message: err.message,
    stack: config.nodeEnv === "development" ? err.stack : undefined,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal server error";

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
    statusCode = 409;
    message = "Resource already exists";
  } else if (err.code === "P2025") {
    statusCode = 404;
    message = "Resource not found";
  } else if (err.name === "PrismaClientKnownRequestError") {
    statusCode = 400;
    message = "Database operation failed";
  }

  const errorResponse = {
    success: false,
    message,
  };

  if (config.nodeEnv === "development") {
    errorResponse.error = {
      name: err.name,
      stack: err.stack,
      code: err.code,
    };
  }

  if (err.errors && Array.isArray(err.errors)) {
    errorResponse.errors = err.errors;
  }

  return res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}
