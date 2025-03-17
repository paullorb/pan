// app/layout.tsx

import './aesthetics/globals.css'
import { CalendarProvider } from './cal/calendarContext';
import { CategoryProvider } from './category/categoryContext';
import { EntryProvider } from './entry/entryContext';
import { AuthProvider } from './auth/authContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon" type="image/png" sizes="any" />
        <title>Pansito</title>
      </head>
      <body>
        <AuthProvider>
          <CalendarProvider>
            <CategoryProvider>
              <EntryProvider>
                {children}
              </EntryProvider>
            </CategoryProvider>
          </CalendarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
