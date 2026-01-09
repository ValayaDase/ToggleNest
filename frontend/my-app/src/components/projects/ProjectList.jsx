import { useEffect, useState } from "react";
import api from "../../api";
import ProjectCard from "./ProjectCard";
import { MdFolder } from "react-icons/md";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Handler to remove deleted project from state
  const handleProjectDeleted = (deletedId) => {
    setProjects(projects.filter((proj) => proj._id !== deletedId));
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading projects...</p>
      </div>
    );
  }

  // Empty State
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <MdFolder className="w-10 h-10 text-purple-600" />
        </div>
        <p className="text-xl font-semibold text-gray-800 mb-2">No projects yet</p>
        <p className="text-gray-600">Create your first project to get started</p>
      </div>
    );
  }

  // Projects Grid
  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">My Projects</h2>
        <p className="text-gray-600">{projects.length} {projects.length === 1 ? 'project' : 'projects'} total</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onProjectDeleted={handleProjectDeleted} // ✅ pass the delete handler
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
