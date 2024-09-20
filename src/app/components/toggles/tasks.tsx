// opens.tsx
"use client";
import React, { useContext } from 'react';
import style from './task.module.css';
import Open from './task';
import { useTasks } from '../../context/tasksContext';
import { useDate } from '../../context/dateContext';
import { TogglesContext } from '@/app/context/togglesContext';

const Tasks: React.FC = () => {
  const { tasks, addTask } = useTasks();
  const { selectedDate } = useDate();

  const togglesContext = useContext(TogglesContext);

  if (!togglesContext) {
    throw new Error("Tasks must be used within a TogglesProvider");
  }

  const { togglesState } = togglesContext;

  if (!togglesState.tasks) {
    return null;
  }


  const selectedDateString = selectedDate.toISOString().split('T')[0];

  // Filter tasks for the selected date
  const openTasks = tasks.filter((task) => task.date === selectedDateString);

  // Calculate counts
  const tasksToDoCount = openTasks.filter((task) => !task.completed).length;
  const totalTasksCount = openTasks.length;

  return (
    <div className={style.container}>
      <div className={style.titleC}>
        <h3 className={style.title}>Tasks</h3>
        <div className={style.count}>
          {tasksToDoCount} / {totalTasksCount}
        </div>
      </div>
      {/* Render existing tasks */}
      {openTasks.map((task) => (
        <Open key={Number(task.id)} task={{ ...task, id: String(task.id) }} />
      ))}
      {/* Render the placeholder input field */}
      <Open isPlaceholder addTask={addTask} />
    </div>
  );
};

export default Tasks;
