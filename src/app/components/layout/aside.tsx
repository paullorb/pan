"use client";

import React, { useContext } from 'react';
import { TogglesContext } from '../../context/togglesContext';
import Month from '../toggles/month/month';
import Priority from '../toggles/priorities/priorities';
import Tasks from '../toggles/tasks/tasks';
import style from './aside.module.css';
import Habits from '../toggles/habits/habits';
import Tags from '../toggles/tags/tags';

const Aside: React.FC = () => {
  const context = useContext(TogglesContext);

  if (!context) {
    return null;
  }

  const { togglesState } = context;

  const hasVisibleComponents = 
    togglesState.priority || 
    togglesState.task || 
    togglesState.month || 
    togglesState.habit || 
    togglesState.tags;

  if (!togglesState.aside || !hasVisibleComponents) {
    return null;
  }

  return (
    <aside className={style.container}>
      {togglesState.month && <Month />}
      {togglesState.priority && <Priority />}
      {togglesState.task && <Tasks />}
      {togglesState.habit && <Habits />}
      {togglesState.tags && <Tags />}
    </aside>
  );
};

export default Aside;