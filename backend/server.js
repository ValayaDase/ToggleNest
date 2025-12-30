import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import connectDB from "./config/db.js";
import { initSocket } from "./socket.js";

import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";

dotenv.config();

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true); // allow ALL origins
  },
  credentials: true,
}));
app.use(express.json());

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/activities", activityRoutes);

/* ---------- TEST ---------- */
app.get("/", (req, res) => {
  res.send("ToggleNest Backend is running 🚀");
});

/* ---------- DB ---------- */
connectDB();

/* ---------- CREATE ONE SERVER ---------- */
const server = http.createServer(app);

/* ---------- INIT SOCKET ---------- */
initSocket(server);

/* ---------- START SERVER ---------- */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server + Socket running on port ${PORT}`);
});
