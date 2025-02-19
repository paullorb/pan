"use client";
import React from 'react';
import { CalendarProvider } from './cal/calendarContext';
import { EntryProvider } from './item/entryContext';
import { AuthProvider } from './nav/authContext';

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CalendarProvider>
          <EntryProvider>
            {children}
          </EntryProvider>
      </CalendarProvider>
    </AuthProvider>
  );
}
