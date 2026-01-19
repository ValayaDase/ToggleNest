import Activity from "../models/ActivityLog.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const getActivities = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ Step 1: User ke sabhi projects find karo
    const projects = await Project. find({ members: userId }).select("_id");
    const projectIds = projects.map(p => p._id);

    // ✅ Step 2: Un projects ki sabhi activities fetch karo
    const activities = await Activity.find({ 
      project: { $in:  projectIds }  // Project ke saare members ki activities
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate({
        path: "project",
        select: "name",
        options: { strictPopulate: false }, 
      })
      .populate({
        path: "user",  // ✅ Kaun ne activity ki
        select: "name email",
      });

    res.json(activities);
  } catch (error) {
    console.error("Get activities error:", error);
    res.status(500).json({ message: "Failed to fetch activities" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalProjects = await Project.countDocuments({
      members: userId,
    });

    const totalTasks = await Task.countDocuments({
      createdBy: userId,
    });

    res.json({
      totalProjects,
      totalTasks,
      userDetails: {
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
