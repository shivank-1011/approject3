import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";
import {
  calculateBalances,
  simplifyDebts,
} from "../services/settlementService.js";

export const getBalances = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await prisma.expense.findMany({
      where: { groupId },
      include: { splits: true },
    });

    const balances = calculateBalances(expenses);

    return successResponse(res, balances);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getSettlements = async (req, res) => {
  try {
    const { groupId } = req.params;

    const expenses = await prisma.expense.findMany({
      where: { groupId },
      include: { splits: true, paidBy: true },
    });

    const balances = calculateBalances(expenses);
    const settlements = simplifyDebts(balances);

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: [
            ...new Set([
              ...settlements.map((s) => s.from),
              ...settlements.map((s) => s.to),
            ]),
          ],
        },
      },
    });

    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

    const enrichedSettlements = settlements.map((s) => ({
      from: userMap[s.from],
      to: userMap[s.to],
      amount: s.amount,
    }));

    return successResponse(res, enrichedSettlements);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createSettlement = async (req, res) => {
  try {
    const { fromUserId, toUserId, amount, groupId } = req.body;

    const settlement = await prisma.settlement.create({
      data: {
        fromUserId,
        toUserId,
        amount: parseFloat(amount),
        groupId,
      },
      include: {
        fromUser: true,
        toUser: true,
      },
    });

    return successResponse(
      res,
      settlement,
      "Settlement recorded successfully",
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getSettlementHistory = async (req, res) => {
  try {
    const { groupId } = req.query;

    const where = groupId ? { groupId } : {};

    const settlements = await prisma.settlement.findMany({
      where,
      include: {
        fromUser: { select: { id: true, name: true, email: true } },
        toUser: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(res, settlements);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
