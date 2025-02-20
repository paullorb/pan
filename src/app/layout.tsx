// app/layout.tsx

import './aesthetics/globals.css'
import { CalendarProvider } from './cal/calendarContext';
import { EntryProvider } from './entry/entryContext';
import { AuthProvider } from './nav/authContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon" type="image/png" sizes="any" />
        <title>Pansito</title>
      </head>
      <body>
        <AuthProvider>
          <CalendarProvider>
              <EntryProvider>
                {children}
              </EntryProvider>
          </CalendarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
