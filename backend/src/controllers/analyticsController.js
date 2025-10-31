import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.userId;

    // Total expenses paid
    const totalPaid = await prisma.expense.aggregate({
      where: { paidById: userId },
      _sum: { amount: true },
    });

    // Total owed to user
    const totalOwed = await prisma.expenseSplit.aggregate({
      where: {
        userId: { not: userId },
        expense: { paidById: userId },
      },
      _sum: { amount: true },
    });

    // Total user owes
    const totalOwing = await prisma.expenseSplit.aggregate({
      where: {
        userId,
        expense: { paidById: { not: userId } },
      },
      _sum: { amount: true },
    });

    // Monthly spending
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyExpenses = await prisma.expense.groupBy({
      by: ["createdAt"],
      where: {
        paidById: userId,
        createdAt: { gte: sixMonthsAgo },
      },
      _sum: { amount: true },
    });

    return successResponse(res, {
      totalPaid: totalPaid._sum.amount || 0,
      totalOwed: totalOwed._sum.amount || 0,
      totalOwing: totalOwing._sum.amount || 0,
      monthlyExpenses,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getGroupAnalytics = async (req, res) => {
  try {
    const { groupId } = req.params;

    // Total group expenses
    const totalExpenses = await prisma.expense.aggregate({
      where: { groupId },
      _sum: { amount: true },
      _count: true,
    });

    // Top spenders in group
    const topSpenders = await prisma.expense.groupBy({
      by: ["paidById"],
      where: { groupId },
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
      take: 5,
    });

    const userIds = topSpenders.map((s) => s.paidById);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
    });

    const userMap = Object.fromEntries(users.map((u) => [u.id, u]));

    const enrichedTopSpenders = topSpenders.map((s) => ({
      user: userMap[s.paidById],
      totalSpent: s._sum.amount,
    }));

    return successResponse(res, {
      totalAmount: totalExpenses._sum.amount || 0,
      totalCount: totalExpenses._count,
      topSpenders: enrichedTopSpenders,
    });
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
