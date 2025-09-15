import "@/app/globals.css";
import ReduxProvider from "@/redux/reduxProvider";
import { ThemeProvider } from "./providers";
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-white">
        <ThemeProvider>
          <ReduxProvider>
            {/* <Header />        ✅ ab header global hai */}
            <main>{children}</main>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
