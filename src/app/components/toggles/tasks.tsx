// opens.tsx
"use client";
import React from 'react';
import style from './task.module.css';
import Open from './task';
import { useTasks } from '../../context/tasksContext';
import { useDate } from '../../context/dateContext';

const Opens: React.FC = () => {
  const { tasks, addTask } = useTasks();
  const { selectedDate } = useDate();

  const selectedDateString = selectedDate.toISOString().split('T')[0];

  // Filter tasks for the selected date
  const openTasks = tasks.filter((task) => task.date === selectedDateString);

  // Calculate counts
  const tasksToDoCount = openTasks.filter((task) => !task.completed).length;
  const totalTasksCount = openTasks.length;

  return (
    <div className={style.container}>
      <div className={style.titleC}>
        <h3 className={style.title}>OPEN</h3>
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

export default Opens;
