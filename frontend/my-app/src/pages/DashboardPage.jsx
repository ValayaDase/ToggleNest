// src/pages/DashboardPage.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
const DashboardPage = () => {

  const navigate = useNavigate();

  const[totalProjects, setTotalProjects] = useState(0);
  const[totalTasks, setTotalTasks] = useState(0);
  const [userName, setUserName] = useState("User");

  useEffect(()=>{
    const fetchStats = async ()=>{
      try{
        const res = await api.get("/activities/dashboard-stats");
        setTotalProjects(res.data.totalProjects);
        setTotalTasks(res.data.totalTasks);
        setUserName(res.data.userDetails.name);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
    }
    fetchStats();
  },[])

  return (
    <div className="p-6 md:p-10 bg-linear-to-br from-purple-100 via-indigo-100 to-purple-200 min-h-full">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Welcome back, {userName} 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Here’s a quick overview of your workspace
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="text-3xl mb-3">📁</div>
          <h3 className="text-sm text-gray-500">Total Projects</h3>
          <span className="text-3xl font-bold text-gray-900">{totalProjects}</span>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="text-3xl mb-3">✅</div>
          <h3 className="text-sm text-gray-500">Total Tasks</h3>
          <span className="text-3xl font-bold text-gray-900">{totalTasks}</span>
        </div>

        {/* <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition">
          <div className="text-3xl mb-3">🔔</div>
          <h3 className="text-sm text-gray-500">Notifications</h3>
          <span className="text-3xl font-bold text-gray-900">0</span>
        </div> */}
      </div>

      {/* LOWER SECTIONS */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Recent Activity
          </h2>
          <p className="text-gray-500 text-sm">
            No recent activity yet.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/dashboard/projects/new")}
              className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-medium cursor-pointer hover:bg-purple-200 transition-all"
            >
              Create Project
            </button>

            {/* <button
              disabled
              className="px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 font-medium cursor-not-allowed"
            >
              Add Task
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
