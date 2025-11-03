import express from "express";
import {
  addExpense,
  getGroupExpenses,
  deleteExpense,
} from "../controllers/expenseController.js";
import { authorizeUser } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/expenses
 * @desc    Add a new expense for a group
 * @access  Private (authenticated users)
 * @body    { description, amount, paidBy, groupId, participants: [{ userId, amount }] }
 */
router.post("/", authorizeUser, addExpense);

/**
 * @route   GET /api/expenses/:groupId
 * @desc    Get all expenses for a specific group
 * @access  Private (authenticated group members)
 * @param   groupId - The ID of the group
 */
router.get("/:groupId", authorizeUser, getGroupExpenses);

/**
 * @route   DELETE /api/expenses/:expenseId
 * @desc    Delete an expense (admin/payer only)
 * @access  Private (authenticated group admins or expense payer)
 * @param   expenseId - The ID of the expense to delete
 */
router.delete("/:expenseId", authorizeUser, deleteExpense);

export default router;
