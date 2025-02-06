"use client";
import React from 'react';
import { CalendarProvider } from './cal/calendarContext';
import { ItemsProvider } from './item/itemContext';

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CalendarProvider>
      <ItemsProvider>
        {children}
      </ItemsProvider>
    </CalendarProvider>
  );
}
