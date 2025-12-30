import { ITEM_TYPE } from "./dndTypes";
import { useDrag } from "react-dnd";
import { MdDragIndicator, MdPerson } from "react-icons/md";

const TaskCard = ({ task }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE.TASK,
    item: { task },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`bg-white rounded-lg p-4 shadow-md border border-gray-200 
        hover:shadow-lg hover:border-purple-300 transition-all cursor-move group
        ${isDragging ? "opacity-50 rotate-2 scale-105" : ""}
      `}
    >
      {/* Drag Handle */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900 flex-1 pr-2">
          {task.title}
        </h3>
        <MdDragIndicator className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors flex-shrink-0" />
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Creator Info */}
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
