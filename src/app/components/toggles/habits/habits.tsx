// components/habits/habits.tsx

"use client";
import React, { useContext } from 'react';
import style from './habits.module.css';
import { useMomentum } from '../../../context/momentumContext';
import { TogglesContext } from '../../../context/togglesContext';
import Habit from './habit';
import AddItem from '../../UI/shared/addItem';
import Title from '../../UI/shared/title';

export default function Habits() {
  const { habits, toggleHabit, addHabit, deleteHabit } = useMomentum();

  const togglesContext = useContext(TogglesContext);

  if (!togglesContext) {
    throw new Error('Habits must be used within a TogglesProvider');
  }

  const { togglesState } = togglesContext;

  if (!togglesState.momentum) {
    return null;
  }

  // Calculate completed habits count
  const completedHabitsCount = habits.filter((habit) => habit.completed).length;
  const totalHabitsCount = habits.length;

  return (
    <div className={style.container}>
      <Title
        title="Habits"
        count={{ completed: completedHabitsCount, total: totalHabitsCount }}
      />
      {habits.map((habit, index) => (
        <Habit
          key={`${habit.name}-${index}`}
          habit={habit}
          index={index}
          toggleHabit={toggleHabit}
          deleteHabit={deleteHabit}
        />
      ))}
      <AddItem placeholder="Add new habit" onAdd={(name) => addHabit(name)} />
    </div>
  );
}
