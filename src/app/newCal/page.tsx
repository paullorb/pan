import React from 'react';
import WeekdayDisplay from './cal/weekDayDisplay';
import DayNavigation from './cal/dayNavigation';
import MonthNavigation from './cal/monthNavigation';
import CalendarTable from './cal/calendarTable';
import Item from './item/item';
import Context from './context/context';
import { ContextProvider } from './context/contextContext';

export default function NewCal() {
  return (
    <ContextProvider>
      <div>
        <header>
          <WeekdayDisplay />
          <DayNavigation />
        </header>
        <main>
          <MonthNavigation />
          <Context />
          <CalendarTable />
          <Item />
        </main>
      </div>
    </ContextProvider>
  );
}
