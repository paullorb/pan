// components/habits/habits.tsx

"use client";
import React, { useContext } from 'react';
import style from './habits.module.css';
import { useMomentum } from '../../../context/momentumContext';
import { TogglesContext } from '../../../context/togglesContext';
import AddItem from '../../shared/addItem';
import Title from '../../shared/title';
import Item from '../../shared/item'; // Import the shared Item component

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

  const completedHabitsCount = habits.filter((habit) => habit.completed).length;
  const totalHabitsCount = habits.length;

  return (
    <div className={style.container}>
      <Title
        title="Habits"
        count={{ completed: completedHabitsCount, total: totalHabitsCount }}
        pagination={true}
      />
      {habits.map((habit, index) => (
        <Item
          key={`${habit.name}-${index}`}
          text={habit.name}
          completed={habit.completed}
          onToggle={() => toggleHabit(index)}
          onDelete={() => deleteHabit(index)}
        />
      ))}
      <AddItem
        placeholder="Add new habit"
        onAdd={(name) => addHabit(name)}
        className={style.addItem}
      />
    </div>
  );
}
