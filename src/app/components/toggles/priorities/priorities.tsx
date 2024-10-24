// components/priorities/priorities.tsx
"use client";

import React, { useContext } from 'react';
import style from './priorities.module.css';
import { useItems } from '../../../context/itemsContext';
import { TogglesContext } from '../../../context/togglesContext';
import Title from '../../shared/title';
import Item from '../../shared/item';

export default function Priorities() {
  const { items, updateItem } = useItems();
  const priorities = items.priority;

  const togglesContext = useContext(TogglesContext);
  if (!togglesContext) {
    throw new Error("Priorities must be used within a TogglesProvider");
  }

  const { togglesState } = togglesContext;
  if (!togglesState.priorities) {
    return null;
  }

  const handleChange = (index: number, value: string) => {
    updateItem('priority', index, value);
  };

  return (
    <div className={style.container}>
      <Title title="Priorities" />
      <div className={style.priorities}>
        {[0, 1, 2].map((index) => (
          <Item
            key={index}
            text={priorities[index]?.text || ''}
            inputMode={true}
            onChange={(value) => handleChange(index, value)}
            label={`${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}