'use client';
import React, { useState } from 'react';
import Weekday from '../cal/weekDay';
import MonthNavigation from '../cal/monthNavigation';
import YearNavigation from '../cal/yearNavigation';
import Category from '../category/category';
import styles from './header.module.css';
import Categories from '../category/categories';

const Header: React.FC = () => {
  const [showCategories, setShowCategories] = useState(false);
  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <div className={styles.calNavigation}>
          <Weekday />
          <MonthNavigation />
          <YearNavigation />
        </div>
        <Category isShown={showCategories} onToggle={() => setShowCategories(prev => !prev)} />
      </div>
      {showCategories && (
        <div className={styles.bottom}>
          <Categories />
        </div>
      )}
    </header>
  );
};

export default Header;
