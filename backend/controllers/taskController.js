import Task from "../models/Task.js";
import { getIO } from "../socket.js";

// CREATE TASK (members + admin)
export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const projectId = req.params.projectId;

    if (!title) {
      return res.status(400).json({ message: "Title required" });
    }

    // find smallest order (latest on top)
    const firstTask = await Task.findOne({ project: projectId })
      .sort({ order: 1 });

    const order = firstTask ? firstTask.order - 1 : 0;

    const task = await Task.create({
      title,
      description,
      project: projectId,
      createdBy: req.user.id,
      order,
    });

    const io = getIO();
    io.to(projectId).emit("taskCreated", task);

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET PROJECT TASKS
export const getProjectTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      project: req.params.projectId,
    })
      .populate("createdBy", "name")
      .sort({ order: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE TASK (status / order)
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true }
    ).populate("createdBy", "name");

    const io = getIO(); // THIS WAS MISSING

    // EMIT BEFORE RESPONSE
    io.to(task.project.toString()).emit("taskUpdated", task);

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
