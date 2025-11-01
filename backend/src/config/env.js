import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/**
 * Validates that required environment variables are set
 * @param {string} key - Environment variable name
 * @param {string} defaultValue - Optional default value
 * @returns {string} - Environment variable value
 * @throws {Error} - If required variable is missing and no default provided
 */
const getEnvVar = (key, defaultValue = null) => {
  const value = process.env[key];

  if (!value && defaultValue === null) {
    console.warn(`Warning: Environment variable ${key} is not set`);
  }

  return value || defaultValue;
};

/**
 * Validates critical environment variables on startup
 */
const validateEnv = () => {
  const requiredVars = ["DATABASE_URL", "JWT_SECRET"];
  const missing = [];

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });

  if (missing.length > 0) {
    console.error(
      `Error: Missing required environment variables: ${missing.join(", ")}`
    );
    console.error(
      "Please create a .env file in the backend directory with the required variables"
    );

    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`
      );
    }
  }
};

// Validate environment variables on module load
validateEnv();

/**
 * Application configuration object
 * Centralizes all environment-based configuration
 */
export const config = {
  // Server configuration
  port: parseInt(getEnvVar("PORT", "3000"), 10),
  nodeEnv: getEnvVar("NODE_ENV", "development"),

  // Database configuration
  databaseUrl: getEnvVar("DATABASE_URL"),

  // JWT configuration
  jwtSecret: getEnvVar("JWT_SECRET"),
  jwtExpiresIn: getEnvVar("JWT_EXPIRES_IN", "7d"),

  // Security configuration
  bcryptRounds: parseInt(getEnvVar("BCRYPT_ROUNDS", "10"), 10),

  // CORS configuration
  corsOrigin: getEnvVar("CORS_ORIGIN", "http://localhost:5173"),

  // Rate limiting
  rateLimitWindowMs: parseInt(getEnvVar("RATE_LIMIT_WINDOW_MS", "900000"), 10), // 15 minutes
  rateLimitMaxRequests: parseInt(
    getEnvVar("RATE_LIMIT_MAX_REQUESTS", "100"),
    10
  ),

  // Logging
  logLevel: getEnvVar("LOG_LEVEL", "info"),

  // Feature flags
  isDevelopment: getEnvVar("NODE_ENV", "development") === "development",
  isProduction: getEnvVar("NODE_ENV", "development") === "production",
  isTest: getEnvVar("NODE_ENV", "development") === "test",
};

// Freeze config to prevent modifications
Object.freeze(config);

export default config;
