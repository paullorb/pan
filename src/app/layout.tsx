import React from 'react';
import { ThemeProvider } from './context/themeContext';
import { HoursProvider } from './context/hoursContext';
import { AuthProvider } from './context/authContext';
import { DateProvider } from './context/dateContext';
import { PrioritiesProvider } from './context/prioritiesContext';
import { TasksProvider } from './context/tasksContext';
import { TogglesProvider } from './context/togglesContext';
import { MomentumProvider } from './context/momentumContext';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon?<generated>" type="image/png" sizes="any" />
        <link rel="apple-icon" href="/apple-icon?<generated>" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon?<generated>" type="image/<generated>" sizes="any" />
        <title>Pansito</title>
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider>
            <TogglesProvider>
              <DateProvider>
                <HoursProvider>
                    <MomentumProvider>
                      <PrioritiesProvider>
                        <TasksProvider>
                          {children}
                        </TasksProvider>
                      </PrioritiesProvider>
                    </MomentumProvider>
                </HoursProvider>
              </DateProvider>
            </TogglesProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
