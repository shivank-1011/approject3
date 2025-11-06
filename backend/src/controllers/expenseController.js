import { PrismaClient } from "@prisma/client";
import { successResponse, errorResponse } from "../utils/response.js";
import {
  createExpenseWithEqualSplits,
  createExpenseWithCustomSplits,
  calculateBalances,
  simplifyBalances,
} from "../services/expenseService.js";
import {
  validateAmount,
  validateExpenseDescription,
  validateParticipants,
  validateGroupId,
} from "../utils/validator.js";

const prisma = new PrismaClient();

export const addExpenseEqualSplit = async (req, res) => {
  try {
    const { description, amount, paidBy, groupId, participants } = req.body;

    if (!description || !amount || !paidBy || !groupId || !participants) {
      return errorResponse(res, "Missing required fields", 400);
    }

    const descValidation = validateExpenseDescription(description);
    if (!descValidation.isValid) {
      return errorResponse(res, descValidation.message, 400);
    }

    const amountValidation = validateAmount(amount);
    if (!amountValidation.isValid) {
      return errorResponse(res, amountValidation.message, 400);
    }

    const groupIdValidation = validateGroupId(groupId);
    if (!groupIdValidation.isValid) {
      return errorResponse(res, groupIdValidation.message, 400);
    }

    const participantsValidation = validateParticipants(participants);
    if (!participantsValidation.isValid) {
      return errorResponse(res, participantsValidation.message, 400);
    }

    const group = await prisma.group.findUnique({
      where: { id: parseInt(groupId) },
      include: {
        members: true,
      },
    });

    if (!group) {
      return errorResponse(res, "Group not found", 404);
    }

    const isMember = group.members.some(
      (member) => member.userId === req.userId
    );

    if (!isMember) {
      return errorResponse(res, "You are not a member of this group", 403);
    }

    const paidByMember = group.members.some(
      (member) => member.userId === parseInt(paidBy)
    );

    if (!paidByMember) {
      return errorResponse(res, "Payer must be a member of the group", 400);
    }

    const memberIds = group.members.map((m) => m.userId);
    for (const participantId of participants) {
      if (!memberIds.includes(parseInt(participantId))) {
        return errorResponse(
          res,
          `User ${participantId} is not a member of this group`,
          400
        );
      }
    }

    const expense = await createExpenseWithEqualSplits({
      description,
      amount,
      paidBy,
      groupId,
      participants,
    });

    return successResponse(
      res,
      expense,
      "Expense added successfully with equal splits",
      201
    );
  } catch (error) {
    console.error("Error adding expense:", error);
    return errorResponse(res, "Failed to add expense", 500);
  }
};

export const addExpense = async (req, res) => {
  try {
    const { description, amount, paidBy, groupId, participants } = req.body;

    if (!description || !amount || !paidBy || !groupId || !participants) {
      return errorResponse(res, "Missing required fields", 400);
    }

    const descValidation = validateExpenseDescription(description);
    if (!descValidation.isValid) {
      return errorResponse(res, descValidation.message, 400);
    }

    const amountValidation = validateAmount(amount);
    if (!amountValidation.isValid) {
      return errorResponse(res, amountValidation.message, 400);
    }

    const groupIdValidation = validateGroupId(groupId);
    if (!groupIdValidation.isValid) {
      return errorResponse(res, groupIdValidation.message, 400);
    }

    if (!Array.isArray(participants) || participants.length === 0) {
      return errorResponse(
        res,
        "Participants array must contain at least one participant",
        400
      );
    }

    const group = await prisma.group.findUnique({
      where: { id: parseInt(groupId) },
      include: {
        members: true,
      },
    });

    if (!group) {
      return errorResponse(res, "Group not found", 404);
    }

    const isMember = group.members.some(
      (member) => member.userId === req.userId
    );

    if (!isMember) {
      return errorResponse(res, "You are not a member of this group", 403);
    }

    const paidByMember = group.members.some(
      (member) => member.userId === parseInt(paidBy)
    );

    if (!paidByMember) {
      return errorResponse(res, "Payer must be a member of the group", 400);
    }

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

    const expense = await createExpenseWithCustomSplits({
      description,
      amount,
      paidBy,
      groupId,
      participants,
    });

    return successResponse(res, expense, "Expense added successfully", 201);
  } catch (error) {
    console.error("Error adding expense:", error);
    return errorResponse(res, "Failed to add expense", 500);
  }
};

export const getGroupExpenses = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await prisma.group.findUnique({
      where: { id: parseInt(groupId) },
      include: {
        members: true,
      },
    });

    if (!group) {
      return errorResponse(res, "Group not found", 404);
    }

    const isMember = group.members.some(
      (member) => member.userId === req.userId
    );

    if (!isMember) {
      return errorResponse(res, "You are not a member of this group", 403);
    }

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

export const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;

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

    const userMember = expense.group.members.find(
      (member) => member.userId === req.userId
    );

    if (!userMember) {
      return errorResponse(res, "You are not a member of this group", 403);
    }

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

export const getGroupBalances = async (req, res) => {
  const groupId = Number(req.params.groupId);

  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
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

    if (!group) {
      return errorResponse(res, "Group not found", 404);
    }

    const isMember = group.members.some(
      (member) => member.userId === req.userId
    );

    if (!isMember) {
      return errorResponse(res, "You are not a member of this group", 403);
    }

    const rawBalances = await calculateBalances(groupId, prisma);

    const transactions = simplifyBalances(rawBalances);

    const transactionsWithNames = transactions
      .map((transaction) => {
        const debtor = group.members.find((m) => m.userId === transaction.from);
        const creditor = group.members.find((m) => m.userId === transaction.to);

        return {
          debtorId: transaction.from,
          creditorId: transaction.to,
          debtorName: debtor?.user?.name || "Unknown User",
          creditorName: creditor?.user?.name || "Unknown User",
          amount: transaction.amount,
        };
      })
      .filter((t) => t.amount > 0.01); // Filter out zero or negligible amounts

    return successResponse(
      res,
      { transactions: transactionsWithNames },
      "Balances calculated successfully"
    );
  } catch (error) {
    console.error("Error calculating balances:", error);
    return errorResponse(res, "Error calculating balances", 500);
  }
};
