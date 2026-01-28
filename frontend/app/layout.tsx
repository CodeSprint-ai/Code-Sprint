import "@/app/globals.css";
import { Provider } from "./providers";
import { Inter, Fira_Code } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fira = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira",
});

export const metadata = {
  title: "CodeSprintAI - Master the Code",
  description: "Master the Code",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${fira.variable}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
