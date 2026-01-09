// backend/controllers/activityController.js
import ActivityLog from "../models/ActivityLog.js";

// GET all activities for the logged-in user
export const getActivities = async (req, res) => {
  try {
    const activities = await ActivityLog.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50); // latest 50 activities
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch activities" });
  }
};

// Optional: dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalProjects = 5; // fetch from Projects collection
    const totalTasks = 20;   // fetch from Tasks collection

    res.json({
      totalProjects,
      totalTasks,
      userDetails: { name: req.user.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
