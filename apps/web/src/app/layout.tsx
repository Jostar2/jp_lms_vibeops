import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Claritas AI Learning Session",
  description: "JP LMS VibeOps production web foundation for governed AI learning sessions."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
