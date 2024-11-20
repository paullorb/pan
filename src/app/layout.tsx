// app/layout.tsx

import './aesthetics/globals.css'
import { ThemeProvider } from './context/themeContext';
import { AuthProvider } from './context/authContext';
import { DateProvider } from './context/dateContext';
import { TogglesProvider } from './context/togglesContext';
import { CurrentHourProvider } from './context/currentHourContext';
import { ItemsProvider } from './context/itemsContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon" type="image/png" sizes="any" />
        <title>Pansito</title>
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
              <TogglesProvider>
                <DateProvider>
                <ItemsProvider>
                  <CurrentHourProvider>
                          {children}
                  </CurrentHourProvider>
                </ItemsProvider>
                </DateProvider>
              </TogglesProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
