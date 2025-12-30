import Project from "../models/Project.js";

const isProjectMember = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id;
    const userId = req.user._id.toString();

    const project = await Project.findById(projectId)
      .populate("members", "_id")
      .populate("createdBy", "_id");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isAdmin =
      project.createdBy._id.toString() === userId;

    const isMember = project.members.some(
      (member) => member._id.toString() === userId
    );

    if (!isAdmin && !isMember) {
      return res.status(403).json({ message: "Access denied" });
    }

    // attach project for controller
    req.project = project;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default isProjectMember;
