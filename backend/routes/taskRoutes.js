import express from "express";
import protect from "../middleware/authMiddleware.js";
import isProjectMember from "../middleware/projectMemberMiddleware.js";
import {
  createTask,
  getProjectTasks,
  updateTask,
} from "../controllers/taskController.js";

const router = express.Router();

// CREATE TASK
// POST /api/tasks/project/:projectId
router.post(
  "/project/:projectId",
  protect,
  isProjectMember,
  createTask
);

// GET PROJECT TASKS
// GET /api/tasks/project/:projectId
router.get(
  "/project/:projectId",
  protect,
  isProjectMember,
  getProjectTasks
);

// UPDATE TASK (drag/drop)
// PUT /api/tasks/:taskId
router.put(
  "/:taskId",
  protect,
  updateTask
);

export default router;
