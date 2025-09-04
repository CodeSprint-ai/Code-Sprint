// app/layout.tsx
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import '@/app/globals.css';
import { ThemeProvider } from "./providers";
import ReduxProvider from '@/redux/reduxProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ReduxProvider>{children}</ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
