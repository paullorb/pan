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

  // Always show 3 priority slots with proper order
  const prioritySlots = Array(3).fill(null).map((_, index) => {
    const existingPriority = priorities.find(p => p.order === index);
    return {
      text: existingPriority?.text || '',
      _id: existingPriority?._id,
      order: index,
      type: 'priority' as const
    };
  });

  const handlePriorityChange = async (index: number, value: string) => {
    await updateItem('priority', index, value, { order: index });
  };

  return (
    <div className={style.container}>
      <Title title="Priorities" />
      <div className={style.priorities}>
        {prioritySlots.map((priority, index) => (
          <Item
            key={`priority-${index}`}
            text={priority.text}
            inputMode={true}
            onChange={(value) => handlePriorityChange(index, value)}
            label={`${index + 1}`}
            disabled={loading.priority}
          />
        ))}
      </div>
    </div>
  );
}