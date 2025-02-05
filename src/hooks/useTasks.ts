// /src/hooks/useTasks.tsx
import { useEffect, useState } from "react";
import { listenToTasks } from "../services/taskService";

export const useTasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = listenToTasks(setTasks);
    return () => unsubscribe();
  }, []);

  return tasks;
};
