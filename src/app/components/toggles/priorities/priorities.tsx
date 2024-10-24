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

  return (
    <div className={style.container}>
      <Title title="Priorities" />
      <div className={style.priorities}>
        {[0, 1, 2].map((num) => (
          <Item
            key={num}
            text={priorities[num]?.text || ''}
            inputMode={true}
            onChange={(value) => updateItem('priority', num, value)}
            label={`${num + 1}`}
          />
        ))}
      </div>
    </div>
  );
}