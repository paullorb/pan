"use client";

import React, { useContext } from 'react';
import style from './priorities.module.css';
import { useItems } from '../../../context/itemsContext';
import { TogglesContext } from '../../../context/togglesContext';
import Title from '../../shared/title';
import Item from '../../shared/item';

export default function Priorities() {
  const { items, updateItem, loading } = useItems();
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
    text: priorities[index]?.text || '',
    _id: priorities[index]?._id,
    type: 'priority' as const,
    id: `priority-${index + 1}` 
  }));

  return (
    <div className={style.container}>
      <Title title="Priorities" />
      <div className={style.priorities}>
        {prioritySlots.map((priority, index) => (
          <Item
            key={priority.id}
            text={priority.text}
            inputMode={true}
            onChange={(value) => updateItem('priority', index, value)}
            label={`${index + 1}`}
            disabled={loading.priority}
            id={priority.id} 
          />
        ))}
      </div>
    </div>
  );
}