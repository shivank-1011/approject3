import express from "express";
import { authorizeUser } from "../middleware/authMiddleware.js";
import { getGroupAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

/**
 * @route   GET /api/analytics/:groupId
 * @desc    Get analytics for a specific group
 * @access  Private (authenticated users)
 * @param   groupId - The ID of the group
 */
router.get("/:groupId", authorizeUser, getGroupAnalytics);

export default router;
