import { PrismaClient } from "@prisma/client";
import { successResponse, errorResponse } from "../utils/response.js";

const prisma = new PrismaClient();

export const recordSettlement = async (req, res) => {
  try {
    const { groupId, paidTo, amount } = req.body;
    const paidBy = req.userId; // The logged-in user who is settling

    if (!groupId || !paidTo || !amount) {
      return errorResponse(res, "Missing required fields", 400);
    }

    if (parseFloat(amount) <= 0) {
      return errorResponse(res, "Amount must be greater than 0", 400);
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

    const paidByMember = group.members.some((m) => m.userId === paidBy);
    const paidToMember = group.members.some(
      (m) => m.userId === parseInt(paidTo)
    );

    if (!paidByMember || !paidToMember) {
      return errorResponse(res, "Both users must be members of the group", 403);
    }

    if (paidBy === parseInt(paidTo)) {
      return errorResponse(res, "Cannot settle with yourself", 400);
    }

    const settlement = await prisma.settlement.create({
      data: {
        groupId: parseInt(groupId),
        paidBy: paidBy,
        paidTo: parseInt(paidTo),
        amount: parseFloat(amount),
      },
    });

    return successResponse(
      res,
      settlement,
      "Settlement recorded successfully",
      201
    );
  } catch (error) {
    console.error("Error recording settlement:", error);
    return errorResponse(res, "Failed to record settlement", 500);
  }
};

export const getGroupSettlements = async (req, res) => {
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

    const isMember = group.members.some((m) => m.userId === req.userId);

    if (!isMember) {
      return errorResponse(res, "You are not a member of this group", 403);
    }

    const settlements = await prisma.settlement.findMany({
      where: { groupId: parseInt(groupId) },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(
      res,
      { settlements },
      "Settlements fetched successfully"
    );
  } catch (error) {
    console.error("Error fetching settlements:", error);
    return errorResponse(res, "Failed to fetch settlements", 500);
  }
};
