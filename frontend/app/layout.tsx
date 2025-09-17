import "@/app/globals.css";
import { Provider } from "./providers";
import Header from "@/components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-white">
        <Provider>
            {/* <Header />        ✅ ab header global hai */}
            <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
