import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * Create a new group
 * @route POST /api/groups
 * @access Private
 */
export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;

    // Validation
    if (!name || name.trim() === "") {
      return errorResponse(res, "Group name is required", 400);
    }

    // Create group with the creator as a member
    const group = await prisma.group.create({
      data: {
        name: name.trim(),
        createdBy: userId,
        members: {
          create: {
            userId: userId,
            role: "admin",
          },
        },
      },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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

    return successResponse(res, group, "Group created successfully", 201);
  } catch (error) {
    console.error("Create group error:", error);
    return errorResponse(res, "Failed to create group", 500);
  }
};

/**
 * Get all groups where user is a member
 * @route GET /api/groups
 * @access Private
 */
export const getUserGroups = async (req, res) => {
  try {
    const userId = req.userId;

    // Find all groups where user is a member
    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse(res, groups, "Groups fetched successfully", 200);
  } catch (error) {
    console.error("Get user groups error:", error);
    return errorResponse(res, "Failed to fetch groups", 500);
  }
};

/**
 * Get single group by ID
 * @route GET /api/groups/:id
 * @access Private
 */
export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Parse group ID
    const groupId = parseInt(id);
    if (isNaN(groupId)) {
      return errorResponse(res, "Invalid group ID", 400);
    }

    // Find group
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    // Check if group exists
    if (!group) {
      return errorResponse(res, "Group not found", 404);
    }

    // Check if user is a member of the group
    const isMember = group.members.some((member) => member.userId === userId);
    if (!isMember) {
      return errorResponse(
        res,
        "You are not authorized to view this group",
        403
      );
    }

    return successResponse(res, group, "Group fetched successfully", 200);
  } catch (error) {
    console.error("Get group by ID error:", error);
    return errorResponse(res, "Failed to fetch group", 500);
  }
};
