// components/habits/habit.tsx

"use client";
import React from 'react';
import style from './habit.module.css';

interface HabitProps {
  habit: {
    name: string;
    completed: boolean;
  };
  index: number;
  toggleHabit: (index: number) => void;
  deleteHabit: (index: number) => void;
}

const Habit: React.FC<HabitProps> = ({ habit, index, toggleHabit, deleteHabit }) => {
  return (
    <div
      className={`${style.habit} ${habit.completed ? style.completed : ''}`}
      onMouseEnter={(e) => e.currentTarget.classList.add(style.hovered)}
      onMouseLeave={(e) => e.currentTarget.classList.remove(style.hovered)}
    >
      <span onClick={() => toggleHabit(index)} className={style.habitName}>
        {habit.name}
      </span>
      <button
        onClick={() => deleteHabit(index)}
        className={style.deleteButton}
      >
        🗑️
      </button>
    </div>
  );
};

export default Habit;
