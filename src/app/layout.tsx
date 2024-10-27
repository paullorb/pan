// app/layout.tsx

import './aesthetics/globals.css'
import { ThemeProvider } from './context/themeContext';
import { HoursProvider } from './context/hoursContext';
import { AuthProvider } from './context/authContext';
import { DateProvider } from './context/dateContext';
import { TasksProvider } from './context/tasksContext';
import { TogglesProvider } from './context/togglesContext';
import { CurrentHourProvider } from './context/currentHourContext';
import { TagsProvider } from './context/tagsContext';
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
            <TagsProvider>
                <DateProvider>
                <ItemsProvider>
                  <CurrentHourProvider>
                    <HoursProvider>
                          <TasksProvider>{children}</TasksProvider>
                    </HoursProvider>
                  </CurrentHourProvider>
                </ItemsProvider>
                </DateProvider>
            </TagsProvider>
              </TogglesProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
