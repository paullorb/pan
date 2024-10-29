"use client";

import React, { useContext } from 'react';
import style from './priorities.module.css';
import { useItems } from '../../../context/itemsContext';
import { TogglesContext } from '../../../context/togglesContext';
import Title from '../../shared/title';
import Item from '../../shared/item';
import AddItem from '../../shared/addItem';

export default function Priorities() {
  const { items, addItem, loading, deleteItem } = useItems();
  const priorities = items.priority;

  const togglesContext = useContext(TogglesContext);
  if (!togglesContext) {
    throw new Error("Priorities must be used within a TogglesProvider");
  }

  const { togglesState } = togglesContext;
  if (!togglesState.priorities) {
    return null;
  }

  // Always show 3 priority slots
  const prioritySlots = Array(3).fill(null).map((_, index) => ({
    text: priorities.find(p => p.order === index + 1)?.text || '',
    _id: priorities.find(p => p.order === index + 1)?._id,
    completed: priorities.find(p => p.order === index + 1)?.completed || false,
    type: 'priority' as const,
    order: index + 1,
    id: `priority-${index + 1}`
  }));

  const handlePriorityAdd = async (text: string, order: number) => {
    if (!text.trim()) return;
    await addItem('priority', text, order);
  };

  const handlePriorityDelete = async (order: number) => {
    const priority = priorities.find(p => p.order === order);
    if (priority?._id) {
      await deleteItem('priority', priority._id);
    }
  };

  return (
    <div className={style.container}>
      <Title title="Priorities" />
      <div className={style.priorities}>
        {prioritySlots.map((priority) => (
          priority.text ? (
            <Item
              key={priority.id}
              text={priority.text}
              completed={priority.completed}
              label={`${priority.order}`}
              disabled={loading.priority}
              onDelete={() => handlePriorityDelete(priority.order)}
              id={priority.id}
            />
          ) : (
            <AddItem
              key={priority.id}
              placeholder={`Priority ${priority.order}`}
              onAdd={(text) => handlePriorityAdd(text, priority.order)}
              className={style.addItem}
            />
          )
        ))}
      </div>
    </div>
  );
}