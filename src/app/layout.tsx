import React from 'react';
import { ThemeProvider } from './themeContext'; 
import { HoursProvider } from './hoursContext';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <HoursProvider>
        <html lang="en">
          <head>
            <link rel="icon" href="/icon?<generated>" type="image/png" sizes="any" />
            <link rel="apple-icon" href="/apple-icon?<generated>" type="image/png" sizes="any" />
            <link rel="apple-touch-icon" href="/apple-icon?<generated>" type="image/<generated>" sizes="any" />
            <title>Pansito</title>
          </head>
          <body>{children}</body>
        </html>
      </HoursProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
