import React from 'react';
import WeekdayDisplay from './cal/weekDayDisplay';
import DayNavigation from './cal/dayNavigation';
import MonthNavigation from './cal/monthNavigation';
import CalendarTable from './cal/calendarTable';
import Item from './item/item';

export default function NewCal() {
  return (
      <div>
        <nav>
          <WeekdayDisplay />
          <DayNavigation />
        </nav>
        <main>
          <MonthNavigation />
          <CalendarTable />
          <Item />
        </main>
      </div>
  );
}
