// components/tasks/tasks.tsx

"use client";
import React, { useContext } from 'react';
import style from './tasks.module.css';
import { useTasks } from '../../../context/tasksContext';
import { TogglesContext } from '../../../context/togglesContext';
import AddItem from '../../UI/shared/addItem';
import Title from '../../UI/shared/title';
import Item from '../../UI/shared/item';

export default function Tasks ()  {
  const { tasks, addTask, toggleTaskCompletion, deleteTask } = useTasks();

  const togglesContext = useContext(TogglesContext);

  if (!togglesContext) {
    throw new Error("Tasks must be used within a TogglesProvider");
  }

  const { togglesState } = togglesContext;

  if (!togglesState.tasks) {
    return null;
  }

  const tasksToDoCount = tasks.filter((task) => !task.completed).length;
  const totalTasksCount = tasks.length;

  return (
    <div className={style.container}>
      <Title
        title="Tasks"
        count={{ completed: tasksToDoCount, total: totalTasksCount }}
      />
      {tasks.map((task) => (
        <Item
          key={task.id}
          text={task.text}
          completed={task.completed}
          onToggle={() => toggleTaskCompletion(task.id)}
          onDelete={() => deleteTask(task.id)}
        />
      ))}
      <AddItem
        placeholder="Add a new task"
        onAdd={(text) => addTask(text)}
        className={style.addItem}
      />
    </div>
  );
};
