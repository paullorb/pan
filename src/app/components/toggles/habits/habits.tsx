// components/habits/habits.tsx
"use client";

import React, { useContext } from 'react';
import style from './habits.module.css';
import { useItems } from '../../../context/itemsContext';
import { TogglesContext } from '../../../context/togglesContext';
import AddItem from '../../shared/addItem';
import Title from '../../shared/title';
import Item from '../../shared/item';

export default function Habits() {
  const { items, loading, toggleItem, addItem, deleteItem } = useItems();
  const habits = items.habit;

  const togglesContext = useContext(TogglesContext);
  if (!togglesContext) {
    throw new Error('Habits must be used within a TogglesProvider');
  }

  const { togglesState } = togglesContext;
  if (!togglesState.tasks) {
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
          key={`${habit.text}-${index}`}
          text={habit.text}
          completed={habit.completed}
          onToggle={() => toggleItem('habit', index)}
          onDelete={() => deleteItem('habit', index)}
          loading={loading.habit}
        />
      ))}
      <AddItem
        placeholder="Add new habit"
        onAdd={(text) => addItem('habit', text)}
        className={style.addItem}
      />
    </div>
  );
}