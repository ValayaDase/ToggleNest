import Project from "../models/Project.js";
import User from "../models/User.js";
import Task from "../models/Task.js";
import Activity from "../models/ActivityLog.js"; 
import Notification from "../models/Notification.js";

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

    await Activity.create({
      type: "project_created",
      message: `Project "${project.name}" was created`,
      user: req.user.id,
      project: project._id,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await Task.deleteMany({ project: projectId });
    await Notification.deleteMany({ project: projectId });

    await Activity.create({
      type: "project_deleted",
      message: `Project "${project.name}" was deleted`,
      user: req.user.id,
      project: projectId, 
    });

    await Project.findByIdAndDelete(projectId);

    res.status(200).json({ message: "Project deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting project." });
  }
};



export const addMemberToProject = async (req, res) => {
  try {
    const { email } = req.body;
    const projectId = req.params.id;

    if (!email) {
      return res.status(400).json({ message: "User email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const alreadyMember = project.members.some(
      (memberId) => memberId.toString() === user._id.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ message: "User already a member" });
    }

    project.members.push(user._id);
    await project.save();

    // Activity log for new member joining
    await Activity.create({
      type: "member_joined",
      message: `${user.name} joined the project "${project.name}"`,
      user: user._id,  // New member ke liye log
      project: projectId,
    });

    res.status(200).json({
      message: "Member added successfully",
      member: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
