import prisma from "../config/prisma.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { validateGroupCreation, validateGroupId } from "../utils/validator.js";
import {
  notifyGroupCreated,
  notifyNewMemberJoined,
} from "../services/notificationService.js";
import { generateUniqueJoinCode } from "../utils/generateJoinCode.js";

export const createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.userId;

    const validation = validateGroupCreation({ name });
    if (!validation.isValid) {
      return errorResponse(res, "Validation failed", 400, validation.errors);
    }

    const joinCode = await generateUniqueJoinCode(prisma);

    const group = await prisma.group.create({
      data: {
        name: name.trim(),
        joinCode: joinCode,
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

    notifyGroupCreated({
      groupName: group.name,
      creatorName: group.createdByUser.name,
      creatorEmail: group.createdByUser.email,
    });

    return successResponse(res, group, "Group created successfully", 201);
  } catch (error) {
    console.error("Create group error:", error);
    return errorResponse(res, "Failed to create group", 500);
  }
};

export const getUserGroups = async (req, res) => {
  try {
    const userId = req.userId;

    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        joinCode: true,
        createdBy: true,
        createdAt: true,
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

export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const groupId = parseInt(id);
    if (isNaN(groupId)) {
      return errorResponse(res, "Invalid group ID", 400);
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: {
        id: true,
        name: true,
        joinCode: true,
        createdBy: true,
        createdAt: true,
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

    if (!group) {
      return errorResponse(res, "Group not found", 404);
    }

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

export const joinGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const user = req.user;

    const validation = validateGroupId(id);
    if (!validation.isValid) {
      return errorResponse(res, validation.message, 400);
    }

    const groupId = validation.value;

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          where: { userId: userId },
        },
      },
    });

    if (!group) {
      return errorResponse(res, "Group not found", 404);
    }

    if (group.members.length > 0) {
      return errorResponse(res, "You are already a member of this group", 409);
    }

    const groupMember = await prisma.groupMember.create({
      data: {
        userId: userId,
        groupId: groupId,
        role: "member",
      },
      include: {
        user: {
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
      },
    });

    notifyNewMemberJoined({
      groupName: groupMember.group.name,
      userName: user.name,
      userEmail: user.email,
    });

    return successResponse(
      res,
      {
        member: groupMember,
        message: `Successfully joined group "${groupMember.group.name}"`,
      },
      "Joined group successfully",
      201
    );
  } catch (error) {
    console.error("Join group error:", error);
    return errorResponse(res, "Failed to join group", 500);
  }
};

export const joinGroupByCode = async (req, res) => {
  try {
    const { joinCode } = req.body;
    const userId = req.userId;
    const user = req.user;

    if (!joinCode || typeof joinCode !== "string" || !joinCode.trim()) {
      return errorResponse(res, "Join code is required", 400);
    }

    const trimmedCode = joinCode.trim().toUpperCase();

    const group = await prisma.group.findUnique({
      where: { joinCode: trimmedCode },
      include: {
        members: {
          where: { userId: userId },
        },
      },
    });

    if (!group) {
      return errorResponse(res, "Invalid join code", 404);
    }

    if (group.members.length > 0) {
      return errorResponse(res, "You are already a member of this group", 409);
    }

    const groupMember = await prisma.groupMember.create({
      data: {
        userId: userId,
        groupId: group.id,
        role: "member",
      },
      include: {
        user: {
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
            joinCode: true,
          },
        },
      },
    });

    notifyNewMemberJoined({
      groupName: groupMember.group.name,
      userName: user.name,
      userEmail: user.email,
    });

    return successResponse(
      res,
      {
        member: groupMember,
        group: group,
        message: `Successfully joined group "${groupMember.group.name}"`,
      },
      "Joined group successfully",
      201
    );
  } catch (error) {
    console.error("Join group by code error:", error);
    return errorResponse(res, "Failed to join group", 500);
  }
};

export const addMemberToGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const userId = req.userId;

    const validation = validateGroupId(id);
    if (!validation.isValid) {
      return errorResponse(res, validation.message, 400);
    }

    const groupId = validation.value;

    if (!email || typeof email !== "string" || !email.trim()) {
      return errorResponse(res, "Email is required", 400);
    }

    const trimmedEmail = email.trim().toLowerCase();

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
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

    const currentUserMembership = group.members.find(
      (member) => member.userId === userId
    );

    if (!currentUserMembership) {
      return errorResponse(res, "You are not a member of this group", 403);
    }

    if (currentUserMembership.role !== "admin") {
      return errorResponse(res, "Only group admins can add members", 403);
    }

    const userToAdd = await prisma.user.findUnique({
      where: { email: trimmedEmail },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!userToAdd) {
      return errorResponse(res, "User with this email does not exist", 404);
    }

    const isAlreadyMember = group.members.some(
      (member) => member.userId === userToAdd.id
    );

    if (isAlreadyMember) {
      return errorResponse(res, "User is already a member of this group", 409);
    }

    const newMember = await prisma.groupMember.create({
      data: {
        userId: userToAdd.id,
        groupId: groupId,
        role: "member",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    notifyNewMemberJoined({
      groupName: group.name,
      userName: userToAdd.name,
      userEmail: userToAdd.email,
    });

    return successResponse(
      res,
      {
        member: newMember,
        message: `${userToAdd.name} has been added to the group`,
      },
      "Member added successfully",
      201
    );
  } catch (error) {
    console.error("Add member to group error:", error);
    return errorResponse(res, "Failed to add member to group", 500);
  }
};

export const removeMemberFromGroup = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const userId = req.userId;

    const validation = validateGroupId(id);
    if (!validation.isValid) {
      return errorResponse(res, validation.message, 400);
    }

    const groupId = validation.value;

    const memberIdNum = parseInt(memberId);
    if (isNaN(memberIdNum)) {
      return errorResponse(res, "Invalid member ID", 400);
    }

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: true,
      },
    });

    if (!group) {
      return errorResponse(res, "Group not found", 404);
    }

    const currentUserMembership = group.members.find(
      (member) => member.userId === userId
    );

    if (!currentUserMembership) {
      return errorResponse(res, "You are not a member of this group", 403);
    }

    const memberToRemove = group.members.find(
      (member) => member.userId === memberIdNum
    );

    if (!memberToRemove) {
      return errorResponse(res, "Member not found in this group", 404);
    }

    const isAdmin = currentUserMembership.role === "admin";
    const isRemovingSelf = memberIdNum === userId;

    if (!isAdmin && !isRemovingSelf) {
      return errorResponse(
        res,
        "You don't have permission to remove this member",
        403
      );
    }

    if (memberToRemove.role === "admin") {
      const adminCount = group.members.filter(
        (member) => member.role === "admin"
      ).length;

      if (adminCount === 1) {
        return errorResponse(
          res,
          "Cannot remove the last admin from the group",
          400
        );
      }
    }

    await prisma.groupMember.delete({
      where: { id: memberToRemove.id },
    });

    return successResponse(
      res,
      { removedMemberId: memberIdNum },
      "Member removed successfully",
      200
    );
  } catch (error) {
    console.error("Remove member from group error:", error);
    return errorResponse(res, "Failed to remove member from group", 500);
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const validation = validateGroupId(id);
    if (!validation.isValid) {
      return errorResponse(res, validation.message, 400);
    }

    const groupId = validation.value;

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        members: true,
        expenses: true,
        settlements: true,
      },
    });

    if (!group) {
      return errorResponse(res, "Group not found", 404);
    }

    const currentUserMembership = group.members.find(
      (member) => member.userId === userId
    );

    if (!currentUserMembership) {
      return errorResponse(res, "You are not a member of this group", 403);
    }

    const isAdmin = currentUserMembership.role === "admin";
    const isCreator = group.createdBy === userId;

    if (!isAdmin && !isCreator) {
      return errorResponse(
        res,
        "Only group admins or creators can delete the group",
        403
      );
    }

    await prisma.group.delete({
      where: { id: groupId },
    });

    return successResponse(
      res,
      {
        deletedGroupId: groupId,
        groupName: group.name,
      },
      "Group deleted successfully",
      200
    );
  } catch (error) {
    console.error("Delete group error:", error);
    return errorResponse(res, "Failed to delete group", 500);
  }
};
