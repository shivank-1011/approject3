import express from "express";
import {
  createGroup,
  getUserGroups,
  getGroupById,
} from "../controllers/groupController.js";
import { authorizeUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.post("/", authorizeUser, createGroup);
router.get("/", authorizeUser, getUserGroups);
router.get("/:id", authorizeUser, getGroupById);

export default router;
