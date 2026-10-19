import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import "@/styles/tokens.css";

export const metadata: Metadata = {
  title: "Hello-md — GitHub Profile README Generator",
  description:
    "Generate a polished, fact-grounded GitHub profile README from your real GitHub activity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-page text-text-primary antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
