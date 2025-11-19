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
import { Suspense } from "react";
import Script from "next/script";

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
  const adsConversionId = process.env.NEXT_PUBLIC_ADS_CONVERSION_ID // 您的 Google Ads Conversion ID

  return (
    <html lang="zh-HK">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=1" />
        <link rel="apple-touch-icon" href="/favicon.ico?v=1" />

        {/* GTM: 由第三方套件注入 */}
        {gtmId && <GoogleTagManager gtmId={gtmId} />}

        {/* Google Ads: gtag.js 主程式庫 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${adsConversionId}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${adsConversionId}', { 
              send_page_view: false  // 避免與 GTM/GA 重複計算頁面瀏覽
            });
          `}
        </Script>
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* GTM noscript */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="Google Tag Manager"
            />
          </noscript>
        )}

        <SessionProvider>
          {/* GTM 頁面瀏覽追蹤 */}
          {gtmId && (
            <Suspense fallback={null}>
              <GTMPageView />
            </Suspense>
          )}

          <Navbar />
          <main>{children}</main>
          <Toaster position="top-center" />
        </SessionProvider>

        {/* Google Analytics (GA4) */}
        {gaId && <GoogleAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}


// // app/layout.tsx
// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { SessionProvider } from "next-auth/react";
// import Navbar from "@/components/Navbar";
// import GoogleAnalytics from "@/components/GoogleAnalytics";
// import { Toaster } from "sonner";
// import { GoogleTagManager } from "@next/third-parties/google";
// import GTMPageView from "@/components/GTMPageView";
// import { Suspense } from "react";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "ITE",
//   description: "探索 ITE 的優質課程和服務",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
//   const gaId = process.env.NEXT_PUBLIC_GA_ID;

//   return (
//     <html lang="zh-HK">
//       <head>
//         <link rel="icon" type="image/x-icon" href="/favicon.ico?v=1" />
//         <link rel="apple-touch-icon" href="/favicon.ico?v=1" />
//         {/* GTM: script 部分（由 @next/third-parties 自動注入） */}
//         {gtmId && <GoogleTagManager gtmId={gtmId} />}
//       </head>

//       <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
//         {/* GTM: noscript 備用（無 JS 時觸發） */}
//         {gtmId && (
//           <noscript>
//             <iframe
//               src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
//               height="0"
//               width="0"
//               style={{ display: "none", visibility: "hidden" }}
//               title="Google Tag Manager"
//             />
//           </noscript>
//         )}

//         <SessionProvider>
//           {/* GTM 頁面瀏覽追蹤（Client Component） */}
//           {gtmId && (
//             <Suspense fallback={null}>
//               <GTMPageView />
//             </Suspense>
//           )}

//           <Navbar />
//           <main>{children}</main>
//           <Toaster position="top-center" />
//         </SessionProvider>

//         {/* Google Analytics */}
//         {gaId && <GoogleAnalytics gaId={gaId} />}
//       </body>
//     </html>
//   );
// }