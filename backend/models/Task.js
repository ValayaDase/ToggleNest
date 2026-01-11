import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,

    status: {
      type: String,
      enum: ["todo", "inProgress", "done"],
      default: "todo",
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
assignedTo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},

    order: {
      type: Number,
      default: 0, 
    },
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
