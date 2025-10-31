import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createGroup = async (req, res) => {
  try {
    const { name, memberIds } = req.body;
    const userId = req.userId;

    const group = await prisma.group.create({
      data: {
        name,
        createdById: userId,
        members: {
          connect: [{ id: userId }, ...memberIds.map((id) => ({ id }))],
        },
      },
      include: { members: true },
    });

    return successResponse(res, group, "Group created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getGroups = async (req, res) => {
  try {
    const userId = req.userId;

    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: { id: userId },
        },
      },
      include: {
        members: { select: { id: true, name: true, email: true } },
        _count: { select: { expenses: true } },
      },
    });

    return successResponse(res, groups);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: { select: { id: true, name: true, email: true } },
        expenses: { include: { paidBy: true } },
      },
    });

    if (!group) {
      return errorResponse(res, "Group not found", 404);
    }

    return successResponse(res, group);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, memberIds } = req.body;

    const group = await prisma.group.update({
      where: { id },
      data: {
        name,
        ...(memberIds && {
          members: {
            set: memberIds.map((id) => ({ id })),
          },
        }),
      },
      include: { members: true },
    });

    return successResponse(res, group, "Group updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.group.delete({ where: { id } });

    return successResponse(res, null, "Group deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
