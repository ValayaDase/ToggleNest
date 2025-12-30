import TaskCard from "./TaskCard";
import { useDrop } from "react-dnd";
import { ITEM_TYPE } from "./dndTypes";
import { MdInbox } from "react-icons/md";

const Column = ({ title, tasks, status, onDropTask }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ITEM_TYPE.TASK,
    drop: (item) => {
      onDropTask(item.task, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Column color based on status
  const getColumnStyle = () => {
    switch (status) {
      case "todo":
        return "from-purple-50 to-purple-100 border-purple-200";
      case "in-progress":
        return "from-indigo-50 to-indigo-100 border-indigo-200";
      case "done":
        return "from-green-50 to-green-100 border-green-200";
      default:
        return "from-gray-50 to-gray-100 border-gray-200";
    }
  };

  const getHeaderStyle = () => {
    switch (status) {
      case "todo":
        return "text-purple-700 bg-purple-100 border-purple-300";
      case "in-progress":
        return "text-indigo-700 bg-indigo-100 border-indigo-300";
      case "done":
        return "text-green-700 bg-green-100 border-green-300";
      default:
        return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };

  return (
    <div
      ref={drop}
      className={`bg-gradient-to-b ${getColumnStyle()} rounded-xl p-4 flex flex-col min-h-[400px] border-2 transition-all
        ${isOver ? "ring-4 ring-purple-300 ring-opacity-50 scale-105" : ""}
      `}
    >
      {/* Column Header */}
      <div className={`flex items-center justify-between px-3 py-2 rounded-lg mb-4 border ${getHeaderStyle()}`}>
        <h2 className="text-sm font-bold uppercase tracking-wide">
          {title}
        </h2>
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/50">
          {tasks.length}
        </span>
      </div>

      {/* Tasks Container */}
      <div className="space-y-3 flex-1">
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-white/50 rounded-full flex items-center justify-center mb-3">
              <MdInbox className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 font-medium">
              No tasks yet
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Drag tasks here
            </p>
          </div>
        )}

        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Column;
