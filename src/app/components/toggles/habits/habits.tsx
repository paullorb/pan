"use client";

import React, { useContext } from 'react';
import style from './habits.module.css';
import { useItems } from '../../../context/itemsContext';
import { TogglesContext } from '../../../context/togglesContext';
import Title from '../../shared/title';
import Item from '../../shared/item';
import AddItem from '../../shared/addItem';
import { handleItemAdd, handleItemDelete } from '../../../lib/utils/itemsOperations';

export default function Habits() {
  const itemsContext = useItems();
  const { items, loading, toggleCompletion } = itemsContext;
  const habits = items.habit;

  const togglesContext = useContext(TogglesContext);
  if (!togglesContext) {
    throw new Error("Habits must be used within a TogglesProvider");
  }

  const { togglesState } = togglesContext;
  if (!togglesState.habits) {
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
      {habits.map((habit) => (
        <Item
          key={habit._id}
          text={habit.text}
          completed={habit.completed}
          onToggle={() => habit._id && toggleCompletion('habit', habit._id)}
          onDelete={() => handleItemDelete(itemsContext, 'habit', habit._id)}
          loading={loading.habit}
        />
      ))}
      <AddItem
        placeholder="Add new habit"
        onAdd={(text) => handleItemAdd(itemsContext, 'habit', text, 0)}
        className={style.addItem}
      />
    </div>
  );
}