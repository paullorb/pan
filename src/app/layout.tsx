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
          <body>{children}</body>
        </html>
      </HoursProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
