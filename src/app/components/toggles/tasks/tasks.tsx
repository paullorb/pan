// components/tasks/tasks.tsx

"use client";
import React, { useContext } from 'react';
import style from './tasks.module.css';
import Task from './task';
import { useTasks } from '../../../context/tasksContext';
import { TogglesContext } from '../../../context/togglesContext';
import AddItem from '../../UI/shared/addItem';
import Title from '../../UI/shared/title';

const Tasks: React.FC = () => {
  const { tasks, addTask } = useTasks();

  const togglesContext = useContext(TogglesContext);

  if (!togglesContext) {
    throw new Error("Tasks must be used within a TogglesProvider");
  }

  const { togglesState } = togglesContext;

  if (!togglesState.tasks) {
    return null;
  }

  const openTasks = tasks;

  // Calculate counts, excluding loading tasks
  const tasksToDoCount = openTasks.filter((task) => !task.completed && !task.loading).length;
  const totalTasksCount = openTasks.filter((task) => !task.loading).length;

  return (
    <div className={style.container}>
      <Title
        title="Tasks"
        count={{ completed: tasksToDoCount, total: totalTasksCount }}
      />
      {openTasks.map((task, index) => (
        <Task
          key={task.id || `task-${index}`}
          task={{ ...task, id: task.id ? String(task.id) : `task-${index}` }}
        />
      ))}
      <AddItem placeholder="Add a new task" onAdd={(text) => addTask(text)} />
    </div>
  );
};

export default Tasks;
