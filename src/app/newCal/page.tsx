import React from 'react';
import WeekdayDisplay from 'app/components/UI/cal/weekDayDisplay';
import DayNavigation from 'app/components/UI/cal/dayNavigation';
import MonthNavigation from 'app/components/UI/cal/monthNavigation';
import CalendarTable from 'app/components/UI/cal/calendarTable';

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
