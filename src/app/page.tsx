import React from 'react';
import Weekday from './cal/weekDay';
import DayNavigation from './cal/dayNavigation';
import MonthNavigation from './cal/monthNavigation';
import CalendarTable from './cal/calendarTable';
import Entry from './entry/entry';
import Nav from './nav/nav';
import styles from './aesthetics/page.module.css';
import './aesthetics/globals.css';

export default function NewCal() {
  return (
      <div>
        <Nav />
        <header className={styles.header}>
          <Weekday />
          <DayNavigation />
          <MonthNavigation />
        </header>
        <main className={styles.main}>
          <CalendarTable />
          <Entry />
        </main>
      </div>
  );
}
