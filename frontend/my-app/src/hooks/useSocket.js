import { useEffect } from "react";
import socket from "../socket";

const useSocket = (projectId, handlers = {}) => {
  useEffect(() => {
    if (!projectId) return;

    socket.emit("joinProject", projectId);

    if (handlers.taskCreated) {
      socket.on("taskCreated", handlers.taskCreated);
    }

    if (handlers.taskUpdated) {
      socket.on("taskUpdated", handlers.taskUpdated);
    }

    if (handlers.projectCompleted) {
      socket.on("projectCompleted", handlers.projectCompleted);
    }

    if (handlers. taskDeleted) {
      socket.on("taskDeleted", handlers.taskDeleted);
    }

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
      socket.off("projectCompleted");
    };
  }, [projectId]);
};

export default useSocket;
