// /components/layout/aside.tsx
"use client"; 

import React, { useContext } from 'react';
import { TogglesContext } from '../../context/togglesContext';
import Month from '../toggles/month/month';
import Priority from '../toggles/priorities/priorities';
import Tasks from '../toggles/tasks/tasks';
import style from './aside.module.css';
import Habits from '../toggles/habits/habits';

const Aside: React.FC = () => {
  const context = useContext(TogglesContext);

  if (!context) {
    return null; // or handle the undefined case appropriately
  }

  const { togglesState } = context;

  const isAsideVisible = togglesState.priorities || togglesState.tasks || togglesState.month || togglesState.momentum;

  if (!isAsideVisible) {
    return null;
  }

  return (
    <aside className={style.aside}>
      {togglesState.month && <Month />}
      {togglesState.priorities && <Priority />}
      {togglesState.tasks && <Tasks />}
      {togglesState.momentum && <Habits />}
    </aside>
  );
};

export default Aside;
