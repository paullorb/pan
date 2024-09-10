import React from 'react';
import { ThemeProvider } from './context/themeContext';
import { HoursProvider } from './context/hoursContext';
import { AuthProvider } from './context/authContext';

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
        <ThemeProvider>
          <HoursProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </HoursProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
