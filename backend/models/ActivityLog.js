import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "task_created",
      "task_completed",
      "task_deleted",
      "project_created",  
      "project_deleted",
      "member_joined"   
    ],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
}, { timestamps: true });


const ActivityLog = mongoose.model("ActivityLog", activitySchema);

export default ActivityLog;
