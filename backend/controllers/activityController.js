import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

// get stats for dashboard
export const getDashboardStats = async(req, res)=>{
    try{
        const userId = req.user._id;

        const totalProjects = await Project.countDocuments({members: userId});       //internally members.includes(userId)
        const totalTasks = await Task.countDocuments({createdBy: userId});
        const userDetails = await User.findById(userId);

        return res.status(200).json({
            totalProjects,
            totalTasks,
            userDetails
        })
    }catch(error){
        console.error("DASHBOARD STATS ERROR:", error.message);
        return res.status(500).json({message: "Server error"
        })
    }
}