// components/tasks/tasks.tsx
"use client";

import React, { useContext } from 'react';
import style from './tasks.module.css';
import { useItems } from '../../../context/itemsContext';
import { TogglesContext } from '../../../context/togglesContext';
import AddItem from '../../shared/addItem';
import Title from '../../shared/title';
import Item from '../../shared/item';

export default function Tasks() {
  const { items, loading, addItem, toggleCompletion, deleteItem } = useItems();
  const tasks = items.task; // Get tasks from items.task array

  const togglesContext = useContext(TogglesContext);
  if (!togglesContext) {
    throw new Error("Tasks must be used within a TogglesProvider");
  }
  
  const { togglesState } = togglesContext;
  if (!togglesState.tasks) {
    return null;
  }

  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const totalTasksCount = tasks.length;

  const handleAddTask = async (text: string) => {
    if (text.trim()) {
      await addItem('task', text);
    }
  };

  const handleToggleTask = async (id: string) => {
    await toggleCompletion('task', id);
  };

  const handleDeleteTask = async (id: string) => {
    await deleteItem('task', id);
  };

  return (
    <div className={style.container}>
      <Title
        title="Tasks"
        count={{ completed: completedTasksCount, total: totalTasksCount }}
        pagination={true}
      />
      {tasks.map((task) => (
        <Item
          key={task._id}
          text={task.text}
          completed={task.completed}
          onToggle={() => handleToggleTask(task._id)}
          onDelete={() => handleDeleteTask(task._id)}
          bullet={true}
          loading={loading.task}
        />
      ))}
      <AddItem
        placeholder="Add a new task"
        onAdd={handleAddTask}
        className={style.addItem}
      />
    </div>
  );
}