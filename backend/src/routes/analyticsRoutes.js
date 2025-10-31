import express from "express";
import {
  getUserAnalytics,
  getGroupAnalytics,
} from "../controllers/analyticsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/user", getUserAnalytics);
router.get("/group/:groupId", getGroupAnalytics);

export default router;
