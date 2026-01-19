import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import isProjectMember from "../middleware/projectMemberMiddleware.js";
import {
  createTask,
  getProjectTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";
import { assignTask } from "../controllers/taskController.js";
import { isProjectAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();


router.put("/:taskId/assign", protect, isProjectAdmin, assignTask);
router.post(
  "/project/:projectId",
  protect,
  isProjectMember,
  createTask
);


router.get(
  "/project/:projectId",
  protect,
  isProjectMember,
  getProjectTasks
);


router.put(
  "/:taskId",
  protect,
  updateTask
);

router.delete(
  "/:taskId",
  protect,
  deleteTask
);

export default router;
