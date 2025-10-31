import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { calculateSplits } from "../services/expenseService.js";

export const createExpense = async (req, res) => {
  try {
    const { description, amount, groupId, participantIds, splitType } =
      req.body;
    const userId = req.userId;

    const expense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        groupId,
        paidById: userId,
        splitType: splitType || "EQUAL",
      },
    });

    // Calculate and create splits
    const splits = calculateSplits(expense.amount, participantIds, splitType);
    await prisma.expenseSplit.createMany({
      data: splits.map((split) => ({
        expenseId: expense.id,
        userId: split.userId,
        amount: split.amount,
      })),
    });

    const fullExpense = await prisma.expense.findUnique({
      where: { id: expense.id },
      include: {
        paidBy: true,
        splits: { include: { user: true } },
      },
    });

    return successResponse(
      res,
      fullExpense,
      "Expense created successfully",
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getExpenses = async (req, res) => {
  try {
    const { groupId } = req.query;

    const where = groupId ? { groupId } : {};

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        paidBy: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true } },
        splits: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(res, expenses);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await prisma.expense.findUnique({
      where: { id },
      include: {
        paidBy: true,
        group: true,
        splits: { include: { user: true } },
      },
    });

    if (!expense) {
      return errorResponse(res, "Expense not found", 404);
    }

    return successResponse(res, expense);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount } = req.body;

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        description,
        amount: amount ? parseFloat(amount) : undefined,
      },
      include: {
        paidBy: true,
        splits: { include: { user: true } },
      },
    });

    return successResponse(res, expense, "Expense updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.expenseSplit.deleteMany({ where: { expenseId: id } });
    await prisma.expense.delete({ where: { id } });

    return successResponse(res, null, "Expense deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
