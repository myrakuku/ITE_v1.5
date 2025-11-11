// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "@/components/Navbar";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { Toaster } from "sonner";
import { GoogleTagManager } from "@next/third-parties/google";
import GTMPageView from "@/components/GTMPageView";
import { Suspense } from "react"; // 新增：Suspense

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
  description: "探索 ITE 的優質課程和服務",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="zh-HK">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=1" />
        <link rel="apple-touch-icon" href="/favicon.ico?v=1" />
        {gtmId && <GoogleTagManager gtmId={gtmId} />}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          {/* 關鍵：用 Suspense 包住 GTMPageView */}
          {gtmId && (
            <Suspense fallback={null}>
              <GTMPageView />
            </Suspense>
          )}

          <Navbar />
          <main>{children}</main>
          <Toaster position="top-center" />
        </SessionProvider>

        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}