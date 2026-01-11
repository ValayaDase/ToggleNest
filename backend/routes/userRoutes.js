import express from "express";
import { deleteAccount } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.delete("/delete", protect, deleteAccount);

export default router;
