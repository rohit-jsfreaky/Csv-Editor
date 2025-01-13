

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider, useUser } from "@clerk/nextjs";

import { Toaster } from "@/components/ui/toaster";
import Header from "./_components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CSV EDITOR",
  description: "Edit Csv Files with Ease",
};

export default function RootLayout({ children}) {


  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Header />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
