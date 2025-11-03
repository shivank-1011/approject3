import express from "express";
import {
  createGroup,
  getUserGroups,
  getGroupById,
  joinGroup,
  joinGroupByCode,
  addMemberToGroup,
  removeMemberFromGroup,
} from "../controllers/groupController.js";
import { authorizeUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.post("/", authorizeUser, createGroup);
router.get("/", authorizeUser, getUserGroups);
router.get("/:id", authorizeUser, getGroupById);
router.post("/:id/join", authorizeUser, joinGroup);
router.post("/join-by-code", authorizeUser, joinGroupByCode);
router.post("/:id/members", authorizeUser, addMemberToGroup);
router.delete("/:id/members/:memberId", authorizeUser, removeMemberFromGroup);

export default router;
