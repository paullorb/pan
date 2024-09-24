// open.tsx
"use client";
import React, { useState } from 'react';
import style from './task.module.css';
import { useTasks } from '../../../context/tasksContext';

interface OpenProps {
  task?: {
    id: string;
    text: string;
    completed: boolean;
  };
  isPlaceholder?: boolean;
  addTask?: (text: string) => void;
}

const Task: React.FC<OpenProps> = ({ task, isPlaceholder = false, addTask }) => {
  const [inputValue, setInputValue] = useState('');
  const { toggleTaskCompletion, deleteTask } = useTasks();

  if (isPlaceholder) {
    const handleAddTask = () => {
      if (inputValue.trim() !== '') {
        addTask && addTask(inputValue.trim());
        setInputValue('');
      }
    };

    return (
      <div
        className={`${style.open} ${style.placeholder}`}
        onMouseEnter={(e) => e.currentTarget.classList.add(style.hovered)}
        onMouseLeave={(e) => e.currentTarget.classList.remove(style.hovered)}
      >
        <input
          type="text"
          className={style.input}
          placeholder="Add a new task"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddTask();
            }
          }}
        />
      </div>
    );
  }

  // For regular tasks
  const handleToggleCompletion = () => {
    toggleTaskCompletion(task!.id);
  };

  const handleDeleteTask = () => {
    deleteTask(task!.id);
  };

  return (
    <div className={`${style.open} ${task?.completed ? style.completed : ''}`}>
      <span onClick={handleToggleCompletion} className={style.taskText}>
        {task?.text}
      </span>
      <button className={style.deleteButton} onClick={handleDeleteTask}>
        🗑️
      </button>
    </div>
  );
};

export default Task;
