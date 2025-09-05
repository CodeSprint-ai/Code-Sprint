// app/layout.tsx
//import { Provider } from "react-redux";
//import { store } from "@/redux/store";
import "@/app/globals.css";
import ReduxProvider from "@/redux/reduxProvider";
import { ThemeProvider } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
