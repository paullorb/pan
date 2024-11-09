"use client";

import React from 'react';
import style from './habits.module.css';
import Title from '../../shared/title';
import Item from '../../shared/item';
import AddItem from '../../shared/addItem';
import { handleItemAdd, handleItemDelete } from '../../../lib/utils/itemOperations';
import { useToggleComponent } from '../../../lib/hooks/useToggleComponent';

export default function Habits() {
  const { 
    items: habits, 
    loading, 
    toggleCompletion, 
    isEnabled, 
    itemsContext 
  } = useToggleComponent('habit');

  if (!isEnabled) {
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
          loading={loading}
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