import express from "express";
import {
  createProject,
  getMyProjects,
  getProjectById,
  deleteProject,
  addMemberToProject
} from "../controllers/projectController.js";
import { isProjectAdmin } from "../middleware/roleMiddleware.js";
import isProjectMember from "../middleware/projectMemberMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getMyProjects);
router.get("/:id", protect, isProjectMember, getProjectById);  
router.delete("/:id", protect, isProjectAdmin, deleteProject);
router.post("/:id/add-member", protect, isProjectAdmin, addMemberToProject);

export default router;
