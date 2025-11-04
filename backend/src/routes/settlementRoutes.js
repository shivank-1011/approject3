import express from "express";
import {
  recordSettlement,
  getGroupSettlements,
} from "../controllers/settlementController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Record a settlement
router.post("/record", recordSettlement);

// Get all settlements for a group
router.get("/:groupId", getGroupSettlements);

export default router;
