import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  message: String,
  createdAt: { type: Date, default: Date.now },
});

export const Notification = mongoose.model("Notification", notificationSchema);
