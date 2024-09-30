// task.tsx

"use client";
import React from 'react';
import style from './task.module.css';
import { useTasks } from '../../../context/tasksContext';

interface TaskProps {
  task: {
    id: string;
    text: string;
    completed: boolean;
    loading?: boolean;
  };
}

const Task: React.FC<TaskProps> = ({ task }) => {
  const { toggleTaskCompletion, deleteTask } = useTasks();

  if (task?.loading) {
    // Render a loading state or skeleton
    return (
      <div className={style.task}>
        {/* Placeholder for loading */}
      </div>
    );
  }

  const handleToggleCompletion = () => {
    toggleTaskCompletion(task.id);
  };

  const handleDeleteTask = () => {
    deleteTask(task.id);
  };

  return (
    <div className={`${style.task} ${task.completed ? style.completed : ''}`}>
      <span onClick={handleToggleCompletion} className={style.taskText}>
        {task.text}
      </span>
      <button className={style.deleteButton} onClick={handleDeleteTask}>
        🗑️
      </button>
    </div>
  );
};

export default Task;
