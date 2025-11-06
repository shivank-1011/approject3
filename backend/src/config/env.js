import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const getEnvVar = (key, defaultValue = null) => {
  const value = process.env[key];

  if (!value && defaultValue === null) {
    console.warn(`Warning: Environment variable ${key} is not set`);
  }

  return value || defaultValue;
};

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

validateEnv();

export const config = {
  port: parseInt(getEnvVar("PORT", "3000"), 10),
  nodeEnv: getEnvVar("NODE_ENV", "development"),
  databaseUrl: getEnvVar("DATABASE_URL"),
  jwtSecret: getEnvVar("JWT_SECRET"),
  jwtExpiresIn: getEnvVar("JWT_EXPIRES_IN", "7d"),
  bcryptRounds: parseInt(getEnvVar("BCRYPT_ROUNDS", "10"), 10),
  corsOrigin: getEnvVar("CORS_ORIGIN", "http://localhost:5173"),
  rateLimitWindowMs: parseInt(getEnvVar("RATE_LIMIT_WINDOW_MS", "900000"), 10),
  rateLimitMaxRequests: parseInt(
    getEnvVar("RATE_LIMIT_MAX_REQUESTS", "100"),
    10
  ),
  logLevel: getEnvVar("LOG_LEVEL", "info"),
  isDevelopment: getEnvVar("NODE_ENV", "development") === "development",
  isProduction: getEnvVar("NODE_ENV", "development") === "production",
  isTest: getEnvVar("NODE_ENV", "development") === "test",
};

Object.freeze(config);

export default config;
