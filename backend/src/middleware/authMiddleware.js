import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { errorResponse } from "../utils/response.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return errorResponse(res, "No token provided", 401);
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return errorResponse(res, "Invalid or expired token", 401);
  }
};
