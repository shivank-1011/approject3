import express from "express";
import {
  getBalances,
  getSettlements,
  createSettlement,
  getSettlementHistory,
} from "../controllers/settlementController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/balances/:groupId", getBalances);
router.get("/suggestions/:groupId", getSettlements);
router.post("/", createSettlement);
router.get("/history", getSettlementHistory);

export default router;
