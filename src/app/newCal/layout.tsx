"use client";
import React from 'react';
import { CalendarProvider } from './cal/calendarContext';
import { ItemsProvider } from './item/itemContext';
import { ContextProvider } from './context/contextContext';
import { AuthProvider } from './nav/authContext';

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <CalendarProvider>
        <ContextProvider>
          <ItemsProvider>
            {children}
          </ItemsProvider>
        </ContextProvider>
      </CalendarProvider>
    </AuthProvider>
  );
}
