"use client";
import { useMomentum } from '../../context/momentumContext';
import style from './momentum.module.css';
import { useContext } from 'react';
import { TogglesContext } from '../../context/togglesContext';

export default function Momentum() {
  const { habits, toggleHabit } = useMomentum();

  const togglesContext = useContext(TogglesContext);

  if (!togglesContext) {
    throw new Error("Tasks must be used within a TogglesProvider");
  }

  const { togglesState } = togglesContext;

  if (!togglesState.momentum) {
    return null;
  }



  return (
    <div className={style.container}>
      <div className={style.title}>Momentum</div>
      <div className={style.progressBar}>
        {habits.filter(habit => habit.completed).length}/{habits.length} Habits Completed
      </div>
      {habits.map((habit, index) => (
        <div
          key={habit.name}
          className={`${style.note} ${habit.completed ? style.completed : ''}`}
          onClick={() => toggleHabit(index)}
        >
          {habit.name}
          <span className={habit.completed ? style.checkMark : ''}>✔️</span>
        </div>
      ))}
    </div>
  );
}
