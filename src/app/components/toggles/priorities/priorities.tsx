"use client";

import React, { useContext } from 'react';
import style from './priorities.module.css';
import { useItems } from '../../../context/itemsContext';
import { TogglesContext } from '../../../context/togglesContext';
import Title from '../../shared/title';
import Item from '../../shared/item';
import AddItem from '../../shared/addItem';
import { handleItemAdd, handleItemDelete, createOrderedSlots } from '../../../lib/utils/itemsOperations';

export default function Priorities() {
  const itemsContext = useItems();
  const { items, loading, toggleCompletion } = itemsContext;
  const priorities = items.priority;

  const togglesContext = useContext(TogglesContext);
  if (!togglesContext) {
    throw new Error("Priorities must be used within a TogglesProvider");
  }

  const { togglesState } = togglesContext;
  if (!togglesState.priorities) {
    return null;
  }

  const prioritySlots = createOrderedSlots(priorities, 3, 'priority');

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
              onDelete={() => handleItemDelete(itemsContext, 'priority', priority._id)}
              onToggle={() => priority._id && toggleCompletion('priority', priority._id)}
              id={priority.id}
            />
          ) : (
            <AddItem
              key={priority.id}
              placeholder={`Priority ${priority.order}`}
              onAdd={(text) => handleItemAdd(itemsContext, 'priority', text, priority.order)}
              className={style.addItem}
            />
          )
        ))}
      </div>
    </div>
  );
}