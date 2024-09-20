// components/toggles/momentum.tsx

"use client";
import React, { useContext, useState } from 'react';
import style from './momentum.module.css';
import { useMomentum } from '../../context/momentumContext';
import { TogglesContext } from '../../context/togglesContext';

export default function Momentum() {
  const { habits, toggleHabit, addHabit, deleteHabit } = useMomentum();
  const [newHabitName, setNewHabitName] = useState('');

  const togglesContext = useContext(TogglesContext);

  if (!togglesContext) {
    throw new Error('Momentum must be used within a TogglesProvider');
  }

  const { togglesState } = togglesContext;

  if (!togglesState.momentum) {
    return null;
  }

  return (
    <div className={style.container}>
      <div className={style.title}>Momentum</div>
      <div className={style.progressBar}>
        {habits.filter((habit) => habit.completed).length}/{habits.length} Habits Completed
      </div>
      {habits.map((habit, index) => (
        <div
          key={`${habit.name}-${index}`}
          className={`${style.note} ${habit.completed ? style.completed : ''}`}
        >
          <span onClick={() => toggleHabit(index)} className={style.habitName}>
            {habit.name}
          </span>
          <span className={habit.completed ? style.checkMark : ''}>✔️</span>
          <button
            onClick={() => deleteHabit(index)}
            className={style.deleteButton}
          >
            🗑️
          </button>
        </div>
      ))}
      <div className={style.addHabit}>
        <input
          type="text"
          placeholder="Add new habit"
          value={newHabitName}
          style={{ border: 'none', outline: 'none' }}
          onChange={(e) => setNewHabitName(e.target.value)}
        />
        <button
          onClick={() => {
            if (newHabitName.trim() !== '') {
              addHabit(newHabitName.trim());
              setNewHabitName('');
            }
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
