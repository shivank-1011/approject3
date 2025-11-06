import express from "express";
import { authorizeUser } from "../middleware/authMiddleware.js";
import { getGroupAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/:groupId", authorizeUser, getGroupAnalytics);

export default router;
