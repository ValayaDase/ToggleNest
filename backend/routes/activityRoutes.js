import {getDashboardStats} from "../controllers/activityController.js";
import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard-stats", protect, getDashboardStats);

export default router;