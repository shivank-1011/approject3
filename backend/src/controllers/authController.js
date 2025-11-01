import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { config } from "../config/env.js";
import { generateToken } from "../utils/jwt.js";
import { validateRegistration, validateLogin } from "../utils/validator.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { AppError } from "../middleware/errorHandler.js";

const prisma = new PrismaClient();

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    const validation = validateRegistration({ name, email, password });
    if (!validation.isValid) {
      return errorResponse(res, "Validation failed", 400, validation.errors);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (existingUser) {
      return errorResponse(res, "User with this email already exists", 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = generateToken(user.id);

    return successResponse(
      res,
      { user, token },
      "User registered successfully",
      201
    );
  } catch (err) {
    console.error("Registration error:", err);
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    const validation = validateLogin({ email, password });
    if (!validation.isValid) {
      return errorResponse(res, "Validation failed", 400, validation.errors);
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (!user) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, "Invalid email or password", 401);
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return successResponse(
      res,
      { user: userWithoutPassword, token },
      "Login successful",
      200
    );
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    // req.user is attached by the authMiddleware
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    return successResponse(
      res,
      { user: req.user },
      "Profile fetched successfully",
      200
    );
  } catch (err) {
    console.error("Get profile error:", err);
    next(err);
  }
};