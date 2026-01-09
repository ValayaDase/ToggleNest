import Project from "../models/Project.js";
import User from "../models/User.js";
import { Notification } from "../models/Notification.js"; 
import Task from "../models/Task.js";

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required" });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PROJECTS FOR LOGGED-IN USER
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE PROJECT , project details
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    // Delete all tasks related to this project
    await Task.deleteMany({ project: projectId });

    // Delete notifications related to this project
    await Notification.deleteMany({ project: projectId });

    // Delete the project itself
    await Project.findByIdAndDelete(projectId);

    res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting project." });
  }
};


// ADD MEMBER (ADMIN ONLY)
export const addMemberToProject = async (req, res) => {
  try {
    const { email } = req.body;
    const projectId = req.params.id;

    if (!email) {
      return res.status(400).json({ message: "User email required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.members.includes(user._id)) {
      return res.status(400).json({ message: "User already a member" });
    }

    project.members.push(user._id);
    await project.save();

    res.json({
      message: "Member added successfully",
      member: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
