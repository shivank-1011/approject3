import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getGroupAnalytics = async (req, res) => {
  const groupId = Number(req.params.groupId);

  try {
    if (isNaN(groupId)) {
      return res.status(400).json({ error: "Invalid group ID" });
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const isMember = await prisma.groupMember.findFirst({
      where: {
        groupId: groupId,
        userId: req.userId,
      },
    });

    if (!isMember) {
      return res
        .status(403)
        .json({ error: "Access denied. You are not a member of this group" });
    }

    const totalExpense = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: { groupId },
    });

    const topSpenders = await prisma.expense.groupBy({
      by: ["paidBy"],
      _sum: { amount: true },
      where: { groupId },
      orderBy: { _sum: { amount: "desc" } },
      take: 3,
    });

    const topSpendersWithDetails = await Promise.all(
      topSpenders.map(async (spender) => {
        const user = await prisma.user.findUnique({
          where: { id: spender.paidBy },
          select: {
            id: true,
            name: true,
            email: true,
          },
        });
        return {
          user,
          totalSpent: spender._sum.amount,
        };
      })
    );

    res.json({
      success: true,
      data: {
        totalExpense: totalExpense._sum.amount || 0,
        topSpenders: topSpendersWithDetails,
      },
    });
  } catch (err) {
    console.error("Analytics fetch error:", err);
    res
      .status(500)
      .json({ error: "Analytics fetch failed", details: err.message });
  }
};
