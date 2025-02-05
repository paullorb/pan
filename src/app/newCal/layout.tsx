"use client";
import React from 'react';
import { CalendarProvider } from 'app/context/calendarContext';

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CalendarProvider>
      <section>
        {children}
      </section>
    </CalendarProvider>
  );
}
