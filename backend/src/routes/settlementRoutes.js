import express from "express";
import {
  recordSettlement,
  getGroupSettlements,
} from "../controllers/settlementController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/record", recordSettlement);
router.get("/:groupId", getGroupSettlements);

export default router;
