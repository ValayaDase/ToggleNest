import { useEffect, useState } from "react";
import api from "../../api";
import { MdHistory } from "react-icons/md"; 

const ActivityPanel = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.get("/activities");
        setActivities(res. data);
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

      <div className="space-y-3">
        {activities.length === 0 && (
          <p className="text-gray-500 text-sm">No recent activity yet.</p>
        )}
        
        {activities.map((activity) => (
          <div 
            key={activity._id} 
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all"
          >
            <div className="flex-shrink-0 mt-0.5">
              <MdHistory className="w-5 h-5 text-purple-500" />
            </div>

            {/* Activity details */}
            <div className="flex-1">
              <p className="text-sm text-gray-800">{activity.message}</p>
              
              <div className="flex items-center gap-2 mt-1 text-xs">
                {/* Project name */}
                {activity.project && (
                  <span className="text-purple-600 font-medium">
                    {activity.project. name}
                  </span>
                )}
                
                {/* User who did the activity */}
                {activity.user && (
                  <span className="text-gray-500">
                    • by {activity.user.name}
                  </span>
                )}
                
                {/* Date */}
                <span className="text-gray-400">
                  • {new Date(activity.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityPanel;