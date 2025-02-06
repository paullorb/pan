import React from 'react';
import WeekdayDisplay from './cal/weekDayDisplay';
import DayNavigation from './cal/dayNavigation';
import MonthNavigation from './cal/monthNavigation';
import CalendarTable from './cal/calendarTable';

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
        </main>
      </div>
  );
}
