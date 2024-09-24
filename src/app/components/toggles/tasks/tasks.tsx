// tasks.tsx
"use client";
import React, { useContext } from 'react';
import style from './task.module.css';
import Task from './task';
import { useTasks } from '../../../context/tasksContext';
import { useDate } from '../../../context/dateContext';
import { TogglesContext } from '@/app/context/togglesContext';
import Skeleton from '../../UI/shared/skeleton'; // Import Skeleton component

const Tasks: React.FC = () => {
  const { tasks, addTask, loading } = useTasks();
  const { selectedDate } = useDate();

  const togglesContext = useContext(TogglesContext);

  if (!togglesContext) {
    throw new Error("Tasks must be used within a TogglesProvider");
  }

  const { togglesState } = togglesContext;

  if (!togglesState.tasks) {
    return null;
  }

  // Show skeleton loader when loading
  if (loading) {
    return (
      <div className={style.container}>
        <Skeleton height="80px" />
      </div>
    );
  }

  // tasks already contains tasks for the selected date
  const openTasks = tasks;

  // Calculate counts, excluding loading tasks
  const tasksToDoCount = openTasks.filter((task) => !task.completed && !task.loading).length;
  const totalTasksCount = openTasks.filter((task) => !task.loading).length;

  return (
    <div className={style.container}>
      <div className={style.titleC}>
        <h3 className={style.title}>Tasks</h3>
        <div className={style.count}>
          {tasksToDoCount} / {totalTasksCount}
        </div>
      </div>
      {openTasks.map((task, index) => (
        <Task
          key={task.id || `task-${index}`}
          task={{ ...task, id: task.id ? String(task.id) : `task-${index}` }}
        />
      ))}
      {/* Render the placeholder input field */}
      <Task isPlaceholder addTask={addTask} />
    </div>
  );
};

export default Tasks;
