import express from "express";
import { getActivities, getDashboardStats } from "../controllers/activityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getActivities);
router.get("/dashboard-stats", protect, getDashboardStats);

export default router;
