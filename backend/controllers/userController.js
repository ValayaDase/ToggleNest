import User from "../models/User.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Activity from "../models/ActivityLog.js";

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await Task.deleteMany({ createdBy: userId });
    await Activity.deleteMany({ user: userId });
    await Project.updateMany({ members: userId }, { $pull: { members: userId } });
    await Project.deleteMany({ createdBy: userId });
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while deleting account." });
  }
};

