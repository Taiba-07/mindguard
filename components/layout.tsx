import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MindGuard — AI Mental Health Companion",
  description: "A safe, private space for college students to talk about mental health.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}