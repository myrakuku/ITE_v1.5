'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

const GoogleAnalytics = ({ gaId }: { gaId: string }) => {
  const pathname = usePathname();

  useEffect(() => {
    if (!gaId || !pathname) return;

    if (typeof window.gtag === 'function') {
      window.gtag('config', gaId, {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
      window.gtag('event', 'page_view', {
        page_path: pathname,
      });
    } else {
      console.warn('Google Analytics gtag is not loaded');
    }
  }, [pathname, gaId]);

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;