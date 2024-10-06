// app/layout.tsx

import './aesthetics/globals.css'
import { ThemeProvider } from './context/themeContext';
import { HoursProvider } from './context/hoursContext';
import { AuthProvider } from './context/authContext';
import { DateProvider } from './context/dateContext';
import { PrioritiesProvider } from './context/prioritiesContext';
import { TasksProvider } from './context/tasksContext';
import { TogglesProvider } from './context/togglesContext';
import { HabitsProvider } from './context/habitsContext';
import { CurrentHourProvider } from './context/currentHourContext';
import { TagsProvider } from './context/tagsContext';

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
                  <CurrentHourProvider>
                    <HoursProvider>
                      <HabitsProvider>
                        <PrioritiesProvider>
                          <TasksProvider>{children}</TasksProvider>
                        </PrioritiesProvider>
                      </HabitsProvider>
                    </HoursProvider>
                  </CurrentHourProvider>
                </DateProvider>
            </TagsProvider>
              </TogglesProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
