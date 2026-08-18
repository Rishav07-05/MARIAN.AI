import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "MARIAN.AI — Intelligence, Built Around You",
  description: "Next-generation personal AI assistant platform for high-throughput reasoning, code synthesis, and contextual task execution.",
  keywords: ["AI", "Artificial Intelligence", "Reasoning", "Code Synthesis", "MARIAN.AI"],
  authors: [{ name: "MARIAN.AI" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0B0C] text-[#F5F5F0] selection:bg-[#F4F6A6] selection:text-[#0B0B0C]">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
