import { ThemeProvider } from './themeContext'; 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ThemeProvider>
  );
}
