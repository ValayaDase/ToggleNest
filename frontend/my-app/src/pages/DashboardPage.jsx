// frontend/src/pages/DashboardPage.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import ActivityPanel from "../components/board/ActivityPanel";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [totalProjects, setTotalProjects] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/activities/dashboard-stats");
        setTotalProjects(res.data.totalProjects);
        setTotalTasks(res.data.totalTasks);
        setUserName(res.data.userDetails?.name || "User");
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 md:p-10 min-h-full bg-gray-100">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm text-gray-500">Total Projects</h3>
          <p className="text-2xl font-bold">{totalProjects}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm text-gray-500">Total Tasks Created</h3>
          <p className="text-2xl font-bold">{totalTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-sm text-gray-500">Quick Actions</h3>
          <button
            onClick={() => navigate("/dashboard/projects/new")}
            className="mt-2 px-4 py-2 rounded-lg bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition-all"
          >
            Create Project
          </button>
        </div>
      </div>

      {/* ACTIVITY PANEL */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ActivityPanel />
      </div>
    </div>
  );
};

export default DashboardPage;
