// components/tasks/tasks.tsx
"use client";

import React from 'react';
import style from './tasks.module.css';
import AddItem from '../../shared/addItem';
import Title from '../../shared/title';
import Item from '../../shared/item';
import { handleItemAdd, handleItemDelete } from '../../../lib/utils/itemOperations';
import { useToggleComponent } from '../../../lib/hooks/useToggleComponent';

export default function Tasks() {
  const { 
    items: task, 
    toggleCompletion, 
    isEnabled, 
    itemsContext 
  } = useToggleComponent('task');

  if (isEnabled === false) { 
    return null;
  }

  const completedTasksCount = task.filter((task) => task.completed).length;
  const totalTasksCount = task.length;

  return (
    <div className={style.container}>
      <Title
        title="Tasks"
        count={{ completed: completedTasksCount, total: totalTasksCount }}
        pagination={true}
      />
      {task.map((task) => (
        <Item
          key={task._id}
          text={task.text}
          completed={task.completed}
          onToggle={() => toggleCompletion('task', task._id)}
          onDelete={() => handleItemDelete(itemsContext, 'task', task._id)}
          bullet={true}
        />
      ))}
      <AddItem
        placeholder="Add a new task"
        onAdd={(text) => handleItemAdd(itemsContext, 'task', text)}
        className={style.addItem}
      />
    </div>
  );
}