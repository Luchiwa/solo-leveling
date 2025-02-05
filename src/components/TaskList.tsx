// /src/components/TaskList.tsx
import { useTasks } from "../hooks/useTasks";

const TaskList = () => {
  const tasks = useTasks();

  return (
    <div>
      <h2>Tâches en cours :</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title} - {task.difficulty} - {task.xpReward} XP</li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
