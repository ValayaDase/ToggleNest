// frontend/src/components/board/ActivityPanel.jsx
import { useEffect, useState } from "react";
import api from "../../api"; // your axios instance

const ActivityPanel = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.get("/activities"); // backend endpoint
        setActivities(res.data);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Activity
      </h2>

      <div className="space-y-2">
        {activities.length === 0 && <p className="text-gray-500">No recent activity yet.</p>}
        {activities.map((activity) => (
          <div key={activity._id} className="flex items-center gap-2">
            {activity.type === "task_created" && <span className="text-blue-500">📌</span>}
            {activity.type === "task_completed" && <span className="text-green-500">✅</span>}
            {activity.type === "task_deleted" && <span className="text-red-500">🗑️</span>}
            <span className="text-gray-700">{activity.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityPanel;
