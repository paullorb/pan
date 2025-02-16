import React from 'react';
import WeekdayDisplay from './cal/weekDayDisplay';
import DayNavigation from './cal/dayNavigation';
import MonthNavigation from './cal/monthNavigation';
import CalendarTable from './cal/calendarTable';
import Item from './item/item';
import Context from './context/context';
import Nav from './nav/nav';

export default function NewCal() {
  return (
      <div>
        <Nav />
        <header>
          <WeekdayDisplay />
          <DayNavigation />
          <MonthNavigation />
        </header>
        <main>
          <Context />
          <CalendarTable />
          <Item />
        </main>
      </div>
  );
}
