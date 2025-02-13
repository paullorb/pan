import React from 'react';
import WeekdayDisplay from './cal/weekDayDisplay';
import DayNavigation from './cal/dayNavigation';
import MonthNavigation from './cal/monthNavigation';
import CalendarTable from './cal/calendarTable';
import Item from './item/item';

export default function NewCal() {
  return (
      <div>
        <header>
          <WeekdayDisplay />
          <DayNavigation />
        </header>
        <main>
          <MonthNavigation />
          <CalendarTable />
          <Item />
        </main>
      </div>
  );
}
