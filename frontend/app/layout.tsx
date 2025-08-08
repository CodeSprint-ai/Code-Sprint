// app/layout.tsx
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import '@/app/globals.css';
import ReduxProvider from '@/redux/reduxProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
