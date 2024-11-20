"use client";

import React from 'react';
import Month from '../toggles/month/month';
import Priority from '../toggles/priorities/priorities';
import style from './aside.module.css';

const Aside: React.FC = () => {

  return (
    <aside className={style.container}>
      <Month />
      <Priority />
    </aside>
  );
};

export default Aside;