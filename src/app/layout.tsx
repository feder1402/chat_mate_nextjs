import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chat Mate",
  description: "LegalShield Chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-dvh max-h-dvh overflow-hidden bg-gradient-to-r from-purple-800 to-purple-400`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
