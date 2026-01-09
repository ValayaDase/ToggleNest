// backend/models/ActivityLog.js
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["task_created", "task_completed", "task_deleted"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  },
  { timestamps: true }
);

const ActivityLog = mongoose.model("ActivityLog", activitySchema);

export default ActivityLog;
