import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import Column from "./Column";
import TaskModal from "./TaskModal";
import useSocket from "../../hooks/useSocket";
import { MdAdd, MdViewKanban } from "react-icons/md";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useAuth } from "../../context/AuthContext";

const BoardLayout = ({ project }) => {
  const { id } = useParams(); 
  const { user } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  const [assigningTaskId, setAssigningTaskId] = useState(null);
  const [assigneeEmail, setAssigneeEmail] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get(`/tasks/project/${id}`);

        const grouped = {
          todo: [],
          inProgress: [],
          done: [],
        };

        res.data.forEach((task) => {
          grouped[task.status].push(task);
        });

        setTasks(grouped);
      } catch (err) {
        console.error(err);
        alert("Failed to load tasks");
      }
    };

    if (id) fetchTasks();
  }, [id]);

  const handleDropTask = async (task, newStatus) => {
    if (task.status === newStatus) return;

    try {
      await api.put(`/tasks/${task._id}`, { status: newStatus });
    } catch (err) {
      alert("Failed to move task");
    }
  };

  useSocket(id, {
    taskCreated: (task) => {
      setTasks((prev) => ({
        ...prev,
        [task.status]: [task, ...prev[task.status]],
      }));
    },
    taskUpdated: (updatedTask) => {
      setTasks((prev) => {
        const cleaned = {
          todo: prev.todo.filter((t) => t._id !== updatedTask._id),
          inProgress: prev.inProgress.filter((t) => t._id !== updatedTask._id),
          done: prev.done.filter((t) => t._id !== updatedTask._id),
        };
        return {
          ...cleaned,
          [updatedTask.status]: [updatedTask, ...cleaned[updatedTask.status]],
        };
      });
    },
    taskDeleted:  ({ taskId }) => {
      setTasks((prev) => ({
        todo: prev.todo.filter((t) => t._id !== taskId),
        inProgress: prev. inProgress.filter((t) => t._id !== taskId),
        done: prev.done.filter((t) => t._id !== taskId),
      }));
    },
  });

  const totalTasks =
    tasks.todo.length + tasks.inProgress.length + tasks.done.length;

  const handleAssignTask = async (taskId, memberEmail) => {
    if (!memberEmail) {
      alert("Select a member to assign");
      return;
    }

    if (!project?._id) {
      alert("Project data not loaded yet");
      return;
    }

    try {
      await api.put(`/tasks/${taskId}/assign`, { 
        email: memberEmail, 
        projectId: project._id 
      });

      alert("Task assigned successfully");
      setAssigningTaskId(null);
      setAssigneeEmail("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign task");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 md:p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <MdViewKanban className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Project Board
                </h1>
                <p className="text-sm text-gray-600">
                  {totalTasks} {totalTasks === 1 ? "task" : "tasks"} total
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-700 hover:to-indigo-700 shadow-lg transition-all"
            >
              <MdAdd className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {["todo", "inProgress", "done"].map((status) => (
            <Column
              key={status}
              title={
                status === "todo"
                  ? "To Do"
                  : status === "inProgress"
                  ? "In Progress"
                  : "Done"
              }
              status={status}
              tasks={tasks[status]}
              onDropTask={handleDropTask}
            />
          ))}
        </div>

       {user && project && project.createdBy?._id === user.id && (
  <div className="mt-6 p-4 bg-white rounded-lg border border-purple-100 shadow-sm">
    <h2 className="text-lg font-semibold text-gray-800 mb-2">
      Assign Task to Member
    </h2>
    {tasks.todo.concat(tasks.inProgress, tasks.done).map((task) => (
      <div
        key={task._id}
        className="flex items-center gap-2 mb-2 p-2 border border-gray-200 rounded hover:bg-purple-50 transition-all"
      >
        <span className="flex-1 font-medium">{task.title}</span>
        <>
          <select
            value={assigningTaskId === task._id ? assigneeEmail : ""}
            onChange={(e) => {
              setAssigningTaskId(task._id);
              setAssigneeEmail(e.target.value);
            }}
            className="border px-2 py-1 rounded"
          >
            <option value="">Select member</option>
            {project.members.map((m) => (
              <option key={m._id} value={m.email}>
                {m.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleAssignTask(task._id, assigneeEmail)}
            disabled={!project._id || !assigneeEmail} 
            className="px-2 py-1 bg-purple-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Assign
          </button>
        </>
      </div>
    ))}
  </div>
)}

        {isModalOpen && <TaskModal onClose={() => setIsModalOpen(false)} />}
      </div>
    </DndProvider>
  );
};

export default BoardLayout;
