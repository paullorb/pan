import React from 'react';
import { ThemeProvider } from './themeContext'; 
import { HoursProvider } from './hoursContext';
import Head from 'next/head'; // Import Head from next/head

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <HoursProvider>
        <html lang="en">
          <Head>
            <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><text y='20' font-size='20'>🍞</text></svg>" />
            <title>Page Title</title>
          </Head>
          <body>{children}</body>
        </html>
      </HoursProvider>
    </ThemeProvider>
  );
};

export default RootLayout;
