import React from 'react';
import Weekday from './cal/weekDay';
import DayNavigation from './cal/dayNavigation';
import MonthNavigation from './cal/monthNavigation';
import CalendarTable from './cal/calendarTable';
import Entry from './entry/entry';
import Nav from './nav/nav';
import styles from './aesthetics/page.module.css';
import './aesthetics/globals.css';
import Category from './category/category';

export default function NewCal() {
  return (
      <div className={styles.container}>
        <Nav />
        <header className={styles.header}>
          <div className={styles.calNavigation}>
            <Weekday />
            <DayNavigation />
            <MonthNavigation />
          </div>
          <div className={styles.categories}>
            <Category />
          </div>
        </header>
        <main className={styles.main}>
            <CalendarTable />
            <Entry />
        </main>
      </div>
  );
}
