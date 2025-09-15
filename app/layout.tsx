// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar"; // 假設 Navbar.tsx 在 components 資料夾中
import Head from "next/head"; // 引入 Head 組件尸
import GoogleAnalytics from "@/components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ITE",
  description: "ITE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        {/* 使用 ITELOGO.jpeg 作為 favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=1" />
        {/* 可選：為 Apple 設備添加支援 */}
        <link rel="apple-touch-icon" href="/favicon.ico?v=1"  />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <Navbar /> {/*  添加 Navbar 組件 */}
          <main>{children}</main> {/* 將頁面內容放入 main 標籤 */}
        </SessionProvider>

        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}