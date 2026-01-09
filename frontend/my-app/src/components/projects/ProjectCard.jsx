import { useNavigate } from "react-router-dom";
import { MdFolder, MdArrowForward, MdCalendarToday, MdDelete } from "react-icons/md";
import api from "../../api"; // your axios instance
import { useState } from "react";

const ProjectCard = ({ project, onProjectDeleted }) => {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      setDeleting(true);
      await api.delete(`/projects/${project._id}`);
      onProjectDeleted(project._id); // remove project from parent list
    } catch (err) {
      console.error("Failed to delete project:", err);
      alert("Failed to delete project. Check console for details.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-purple-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 overflow-hidden group">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <MdFolder className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white truncate flex-1">{project.name}</h3>
        </div>

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-1 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all"
          title="Delete Project"
        >
          <MdDelete className="w-5 h-5" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-5">
        {project.description ? (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{project.description}</p>
        ) : (
          <p className="text-sm text-gray-400 italic mb-4">No description</p>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <MdCalendarToday className="w-4 h-4" />
          <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Open Button */}
        <button
          onClick={() => navigate(`/dashboard/projects/${project._id}`)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all group"
        >
          Open Board
          <MdArrowForward className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
