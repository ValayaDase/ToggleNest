import Project from "../models/Project.js";

export const isProjectAdmin = async (req, res, next) => {
  try {
    const projectId = req.params.id || req.body.projectId;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID required" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only project admin allowed" });
    }

    req.project = project;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
