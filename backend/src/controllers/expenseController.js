import { PrismaClient } from "@prisma/client";
import { successResponse, errorResponse } from "../utils/response.js";

const prisma = new PrismaClient();

/**
 * Add a new expense for a group
 * POST /api/expenses
 * Body: { description, amount, paidBy, groupId, participants: [{ userId, amount }] }
 */
export const addExpense = async (req, res) => {
  try {
    const { description, amount, paidBy, groupId, participants } = req.body;

    // Validate required fields
    if (!description || !amount || !paidBy || !groupId || !participants) {
      return errorResponse(res, "Missing required fields", 400);
    }

    // Validate amount
    if (amount <= 0) {
      return errorResponse(res, "Amount must be greater than 0", 400);
    }

    // Validate participants array
    if (!Array.isArray(participants) || participants.length === 0) {
      return errorResponse(
        res,
        "Participants array must contain at least one participant",
        400
      );
    }

    // Verify group exists
    const group = await prisma.group.findUnique({
      where: { id: parseInt(groupId) },
      include: {
        members: true,
      },
    });

    if (!group) {
      return errorResponse(res, "Group not found", 404);
    }

    // Verify user is a member of the group
    const isMember = group.members.some(
      (member) => member.userId === req.userId
    );

    if (!isMember) {
      return errorResponse(res, "You are not a member of this group", 403);
    }

    // Verify paidBy user exists and is a member
    const paidByMember = group.members.some(
      (member) => member.userId === parseInt(paidBy)
    );

    if (!paidByMember) {
      return errorResponse(res, "Payer must be a member of the group", 400);
    }

    // Verify all participants are members of the group
    const memberIds = group.members.map((m) => m.userId);
    for (const participant of participants) {
      if (!memberIds.includes(parseInt(participant.userId))) {
        return errorResponse(
          res,
          `User ${participant.userId} is not a member of this group`,
          400
        );
      }

      if (participant.amount <= 0) {
        return errorResponse(
          res,
          "Participant split amount must be greater than 0",
          400
        );
      }
    }

    // Verify total split amounts equal the expense amount
    const totalSplitAmount = participants.reduce(
      (sum, p) => sum + parseFloat(p.amount),
      0
    );

    if (Math.abs(totalSplitAmount - parseFloat(amount)) > 0.01) {
      return errorResponse(
        res,
        `Total split amounts (${totalSplitAmount}) must equal expense amount (${amount})`,
        400
      );
    }

    // Create expense with splits in a transaction
    const expense = await prisma.expense.create({
      data: {
        description,
        amount: parseFloat(amount),
        paidBy: parseInt(paidBy),
        groupId: parseInt(groupId),
        splits: {
          create: participants.map((p) => ({
            userId: parseInt(p.userId),
            amount: parseFloat(p.amount),
          })),
        },
      },
      include: {
        paidByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        splits: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return successResponse(res, expense, "Expense added successfully", 201);
  } catch (error) {
    console.error("Error adding expense:", error);
    return errorResponse(res, "Failed to add expense", 500);
  }
};

/**
 * Get all expenses for a group
 * GET /api/expenses/:groupId
 */
export const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Verify group exists
    const group = await prisma.group.findUnique({
      where: { id: parseInt(groupId) },
      include: {
        members: true,
      },
    });

    if (!group) {
      return errorResponse(res, "Group not found", 404);
    }

    // Verify user is a member of the group
    const isMember = group.members.some(
      (member) => member.userId === req.userId
    );

    if (!isMember) {
      return errorResponse(res, "You are not a member of this group", 403);
    }

    // Fetch all expenses for the group
    const expenses = await prisma.expense.findMany({
      where: {
        groupId: parseInt(groupId),
      },
      include: {
        paidByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        splits: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse(
      res,
      {
        groupId: group.id,
        groupName: group.name,
        expenses,
        totalExpenses: expenses.length,
      },
      "Expenses fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return errorResponse(res, "Failed to fetch expenses", 500);
  }
};

/**
 * Delete an expense by ID (admin only)
 * DELETE /api/expenses/:expenseId
 */
export const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

    // Verify expense exists
    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(expenseId) },
      include: {
        group: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!expense) {
      return errorResponse(res, "Expense not found", 404);
    }

    // Check if user is admin of the group or creator of the expense
    const userMember = expense.group.members.find(
      (member) => member.userId === req.userId
    );

    if (!userMember) {
      return errorResponse(res, "You are not a member of this group", 403);
    }

    // Allow deletion if user is admin or if they created the expense
    const isAdmin = userMember.role === "admin";
    const isCreator = expense.group.createdBy === req.userId;
    const isPayer = expense.paidBy === req.userId;

    if (!isAdmin && !isCreator && !isPayer) {
      return errorResponse(
        res,
        "Only group admins or expense payer can delete expenses",
        403
      );
    }

    // Delete expense (splits will be cascade deleted)
    await prisma.expense.delete({
      where: { id: parseInt(expenseId) },
    });

    return successResponse(
      res,
      { expenseId: parseInt(expenseId) },
      "Expense deleted successfully"
    );
  } catch (error) {
    console.error("Error deleting expense:", error);
    return errorResponse(res, "Failed to delete expense", 500);
  }
};
