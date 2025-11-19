// components/GoogleAdsConversion.tsx
'use client';

export function reportGoogleAdsConversion({
  transactionId,
  url,
}: {
  transactionId?: string;
  url?: string;
} = {}) {
  const callback = () => {
    if (url) {
      window.location.href = url;
    }
  };

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', {
      send_to: 'AW-17538190885/Tql-COKsoL8bEKWc7qpB',
      transaction_id: transactionId || '',
      event_callback: callback,
    });
  } else {
    console.warn('gtag 未載入，轉換事件未發送');
    callback();
  }

  return false;
}