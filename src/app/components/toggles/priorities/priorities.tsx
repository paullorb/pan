"use client";

import React, {useState, useEffect} from 'react';
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
    itemsContext 
  } = useToggleComponent('priority');

  const [visibleCount, setVisibleCount] = useState(3);
  const prioritySlots = createOrderedSlots(priorities, 10, 'priority');

  const areAllVisibleSlotsFilled = prioritySlots
    .slice(0, visibleCount)
    .every((priority) => priority.text);

  useEffect(() => {
    if (areAllVisibleSlotsFilled && visibleCount < prioritySlots.length) {
      setVisibleCount(visibleCount + 1);
    }
  }, [areAllVisibleSlotsFilled, visibleCount, prioritySlots]);

  return (
    <div className={style.container}>
      <Title title="Priorities" />
      <div className={style.priorities}>
        {prioritySlots.slice(0, visibleCount).map((priority) => (
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