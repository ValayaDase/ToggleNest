import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { useAuth } from "../../context/AuthContext";
import BoardLayout from "../../components/board/BoardLayout";
import { MdPeople, MdPersonAdd, MdEmail, MdAdminPanelSettings } from "react-icons/md";
import useSocket from "../../hooks/useSocket";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const ProjectDetail = () => {
  const { id } = useParams(); 
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [taskIdToAssign, setTaskIdToAssign] = useState("");
  const [assigneeEmail, setAssigneeEmail] = useState("");
  const [tasks, setTasks] = useState([]);

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data);

      const taskRes = await api.get(`/tasks/project/${id}`);
      setTasks(taskRes.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load project");
    }
  };

  useSocket(project?._id, {
    projectCompleted: (data) => {
      toast.success(data.message); 
    },
  });

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading project...</p>
      </div>
    );
  }

  const isAdmin = project.createdBy._id === user?.id;

  const handleAddMember = async () => {
    if (!email.trim()) {
      alert("Enter member email");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/projects/${id}/add-member`, { email });
      setEmail("");
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTask = async () => {
    if (!taskIdToAssign || !assigneeEmail) {
      alert("Select task and member");
      return;
    }

    try {
      await api.put(`/tasks/${taskIdToAssign}/assign`, { email: assigneeEmail });
      alert("Task assigned successfully");
      setTaskIdToAssign("");
      setAssigneeEmail("");
      fetchProject();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign task");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
            {project.description && <p className="text-gray-600">{project.description}</p>}
          </div>

          {isAdmin && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg border border-purple-200">
              <MdAdminPanelSettings className="w-5 h-5 text-purple-700" />
              <span className="text-sm font-semibold text-purple-700">Project Admin</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <MdPeople className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-800">Team Members</h2>
            <span className="ml-auto text-sm font-medium text-gray-500">
              {project.members.length} {project.members.length === 1 ? "member" : "members"}
            </span>
          </div>

          <ul className="space-y-3">
            {project.members.map((member) => (
              <li
                key={member._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-200 hover:bg-purple-50/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{member.name}</span>

                      {member._id === project.createdBy._id && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded">
                          Admin
                        </span>
                      )}

                      {member._id === user?.id && member._id !== project.createdBy._id && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded">
                          You
                        </span>
                      )}
                    </div>

                    <span className="text-sm text-gray-500">{member.email}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {isAdmin && (
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <MdPersonAdd className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-800">Add Member</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <MdEmail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                onClick={handleAddMember}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
              >
                {loading ? "Adding..." : "Add Member"}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
        <BoardLayout project={project} />
      </div>
    </div>
  );
};

export default ProjectDetail;
