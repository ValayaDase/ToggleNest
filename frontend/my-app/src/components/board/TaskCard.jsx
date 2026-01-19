import { ITEM_TYPE } from "./dndTypes";
import { useDrag } from "react-dnd";
import { MdDragIndicator, MdPerson, MdDelete } from "react-icons/md";
import api from "../../api";

const TaskCard = ({ task }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE.TASK,
    item: { task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this task?")) return;

    try {
      await api. delete(`/tasks/${task._id}`);
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  return (
    <div
      ref={drag}
      className={`bg-white rounded-lg p-4 shadow-md border border-gray-200 
        hover:shadow-lg hover:border-purple-300 transition-all cursor-move group
        ${isDragging ? "opacity-50 rotate-2 scale-105" : ""}
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900 flex-1 pr-2">
          {task.title}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={handleDelete}
            className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
            title="Delete"
          >
            <MdDelete className="w-4 h-4" />
          </button>
          <MdDragIndicator className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors flex-shrink-0" />
        </div>
      </div>
{task.assignedTo && (
  <div className="mt-2 text-xs font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded inline-block">
    Assigned to: {task.assignedTo.name}
  </div>
)}

      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
          <span className="text-[10px] font-semibold text-white">
            {task.createdBy?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-[10px] text-gray-500">
          {task.createdBy?.name}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
