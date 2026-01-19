import Task from "../models/Task.js";
import User from "../models/User.js";
import Project from "../models/Project.js";
import { getIO } from "../socket.js";
import Activity from "../models/ActivityLog.js";
import Notification from "../models/Notification.js";


export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const projectId = req.params.projectId;

    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }

    const firstTask = await Task.findOne({ project: projectId }).sort({ order: 1 });
    const order = firstTask ? firstTask.order - 1 : 0;

    const task = await Task.create({
      title,
      description,
      project: projectId,
      createdBy: req.user.id,
      order,
    });

    //activity log for task create
    await Activity.create({
      type: "task_created",
      message: `Task "${task.title}" was created`,
      user: req.user.id,
      project: projectId,
    });

    const io = getIO();
    io.to(projectId).emit("taskCreated", task);

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const projectId = task.project. toString();
    
    await Task.findByIdAndDelete(taskId);

    //activity log for task delete
    await Activity.create({
      type: "task_deleted",
      message: `Task "${task.title}" was deleted`,
      user: req.user.id,
      project: projectId,
    });

    const io = getIO();
    io.to(projectId).emit("taskDeleted", { taskId });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("createdBy", "name")
      .populate("assignedTo", "name email")
      .sort({ order: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true })
      .populate("createdBy", "name")
      .populate("assignedTo", "name email");

    const io = getIO();
    io.to(task.project.toString()).emit("taskUpdated", task);

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const assignTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { email, projectId } = req.body;

    if (!email || !projectId) {
      return res.status(400).json({ message: "Email and projectId required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const isMember = project.members.some(
      (memberId) => memberId.toString() === user._id.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "User is not a project member" });
    }

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.assignedTo) {
      return res.status(400).json({
        message: "Task is already assigned to a member",
      });
    }

    task.assignedTo = user._id;
    await task.save();

    const io = getIO();
    io.to(projectId).emit("taskUpdated", task);

    const notification = await Notification.create({
      user: user._id,
      message: `A new task "${task.title}" was assigned to you`,
    });

    io.to(user._id.toString()).emit("newNotification", notification);

    res.status(200).json({
      message: "Task assigned successfully",
      task,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
