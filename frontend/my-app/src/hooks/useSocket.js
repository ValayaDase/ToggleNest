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

    return () => {
      socket.off("taskCreated");
      socket.off("taskUpdated");
    };
  }, [projectId]);
};

export default useSocket;
