import express from "express";
import {
  addExpense,
  addExpenseEqualSplit,
  getGroupExpenses,
  deleteExpense,
  getGroupBalances,
} from "../controllers/expenseController.js";
import { authorizeUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/equal", authorizeUser, addExpenseEqualSplit);
router.post("/", authorizeUser, addExpense);
router.get("/:groupId", authorizeUser, getGroupExpenses);
router.get("/balance/:groupId", authorizeUser, getGroupBalances);
router.delete("/:expenseId", authorizeUser, deleteExpense);

export default router;
