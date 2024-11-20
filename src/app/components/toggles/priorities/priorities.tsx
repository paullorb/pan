"use client";

import React from 'react';
import style from './priorities.module.css';
import Title from '../../shared/title';
import Item from '../../shared/item';
import AddItem from '../../shared/addItem';
import { handleItemAdd, handleItemDelete, createOrderedSlots } from '../../../lib/utils/itemOperations';
import { useToggleComponent } from '../../../lib/hooks/useToggleComponent';

export default function Priorities() {
  const { 
    items: priorities, 
    loading, 
    toggleCompletion, 
    isEnabled, 
    itemsContext 
  } = useToggleComponent('priority');

  if (isEnabled === false) { 
    return null;
  }

  const prioritySlots = createOrderedSlots(priorities, 5, 'priority');

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
              disabled={loading}
              onToggle={() => priority._id && toggleCompletion('priority', priority._id)}
              onDelete={() => priority._id && handleItemDelete(itemsContext, 'priority', priority._id)}
              id={priority.id}
            />
          ) : (
            <AddItem
              key={priority.id}
              placeholder={`${priority.order}. Priority`}
              onAdd={(text) => handleItemAdd(itemsContext, 'priority', text, priority.order)}
              className={style.addItem}
            />
          )
        ))}
      </div>
    </div>
  );
}