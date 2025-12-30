import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import Column from "./Column";
import TaskModal from "./TaskModal";
import useSocket from "../../hooks/useSocket";
import { MdAdd, MdViewKanban } from "react-icons/md";

// DnD imports
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const BoardLayout = () => {
  const { id } = useParams(); // project id
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  /* =========================
     FETCH TASKS (INITIAL LOAD)
     ========================= */
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

  /* =========================
     DRAG & DROP HANDLER
     ========================= */
  const handleDropTask = async (task, newStatus) => {
    if (task.status === newStatus) return;

    try {
      await api.put(`/tasks/${task._id}`, {
        status: newStatus,
      });
    } catch (err) {
      alert("Failed to move task");
    }
  };

  /* =========================
     SOCKET EVENTS (REAL-TIME)
     ========================= */
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
          [updatedTask.status]: [
            updatedTask,
            ...cleaned[updatedTask.status],
          ],
        };
      });
    },
  });

  // Calculate total tasks
  const totalTasks = tasks.todo.length + tasks.inProgress.length + tasks.done.length;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 md:p-6">
        
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Title Section */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <MdViewKanban className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Project Board
                </h1>
                <p className="text-sm text-gray-600">
                  {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'} total
                </p>
              </div>
            </div>

            {/* Add Task Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-700 hover:to-indigo-700 shadow-lg transition-all"
            >
              <MdAdd className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </div>

        {/* BOARD COLUMNS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          <Column
            title="To Do"
            status="todo"
            tasks={tasks.todo}
            onDropTask={handleDropTask}
          />

          <Column
            title="In Progress"
            status="inProgress"
            tasks={tasks.inProgress}
            onDropTask={handleDropTask}
          />

          <Column
            title="Done"
            status="done"
            tasks={tasks.done}
            onDropTask={handleDropTask}
          />
        </div>

        {/* ADD TASK MODAL */}
        {isModalOpen && (
          <TaskModal onClose={() => setIsModalOpen(false)} />
        )}
      </div>
    </DndProvider>
  );
};

export default BoardLayout;
