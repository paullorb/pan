"use client"; 

import React, { useContext } from 'react';
import { TogglesContext } from '../../context/togglesContext';
import DateComponent from '../toggles/date/date';
import Month from '../toggles/month/month';
import Priority from '../toggles/priorities/priorities';
import Tasks from '../toggles/tasks/tasks';
import Momentum from '../toggles/momentum/momentum';
import style from './aside.module.css';

const Aside: React.FC = () => {
  const context = useContext(TogglesContext);

  if (!context) {
    return null; // or handle the undefined case appropriately
  }

  const { togglesState } = context;

  const isAsideVisible = togglesState.priorities || togglesState.tasks || togglesState.month || togglesState.date || togglesState.momentum;

  if (!isAsideVisible) {
    return null;
  }

  return (
    <aside className={style.aside}>
      {togglesState.date && <DateComponent />}
      {togglesState.month && <Month />}
      {togglesState.priorities && <Priority />}
      {togglesState.tasks && <Tasks />}
      {togglesState.momentum && <Momentum />}
    </aside>
  );
};

export default Aside;
