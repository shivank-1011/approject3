import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { errorResponse } from "../utils/response.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return errorResponse(res, "No token provided", 401);
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    req.userId = decoded.userId || decoded.id;

    // Fetch the full user object and attach it to req.user
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, "Invalid or expired token", 401);
  }
};

// Alias for better readability
export const authorizeUser = authMiddleware;
