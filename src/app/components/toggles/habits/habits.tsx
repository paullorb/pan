// components/habits/habits.tsx

"use client";
import React, { useContext } from 'react';
import style from './habits.module.css';
import { useHabits } from '../../../context/habitsContext';
import { TogglesContext } from '../../../context/togglesContext';
import AddItem from '../../shared/addItem';
import Title from '../../shared/title';
import Item from '../../shared/item';

export default function Habits() {
  const { habits, toggleHabit, addHabit, deleteHabit } = useHabits();

  const togglesContext = useContext(TogglesContext);
  if (!togglesContext) {
    throw new Error('Habits must be used within a TogglesProvider');
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
