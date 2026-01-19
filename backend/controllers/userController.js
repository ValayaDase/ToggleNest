import User from "../models/User.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Activity from "../models/ActivityLog.js";
import Notification from "../models/Notification.js";

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const ownedProjects = await Project.find({ createdBy: userId }).select("_id");
    const ownedProjectIds = ownedProjects.map(p => p._id);

    await Task.deleteMany({ createdBy: userId });

    if (ownedProjectIds.length > 0) {
      await Task.deleteMany({ project: { $in: ownedProjectIds } });
    }

    await Activity.deleteMany({ user: userId });

    await Notification.deleteMany({ user: userId });

    await Project.updateMany(
      { members: userId },
      { $pull: { members: userId } }
    );

    await Project.deleteMany({ createdBy: userId });

    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Server error while deleting account." });
  }
};

