import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "企業AI培訓｜NITTP資助｜企業技術轉移",
  description: "香港企業AI培訓，NITTP認可培訓機構，最高50%政府資助。M365 Copilot、AI Agent、私有化LLM部署，為NGO、公營機構、企業定制落地式AI技術轉移課程。免費索取培訓方案。",
  openGraph: {
    title: "企業AI培訓｜NITTP資助｜企業技術轉移｜ITE InnoTrendEDU",
    description: "香港企業AI培訓，NITTP認可培訓機構，最高50%政府資助。M365 Copilot、AI Agent、私有化LLM部署，為NGO、公營機構、企業定制落地式AI技術轉移課程。免費索取培訓方案。",
    url: "https://ite.edu.hk/corporate",
    locale: "zh_HK",
    type: "website",
    images: [{
      url: "/corporate.png",
      width: 1200,
      height: 800,
      alt: "企業AI培訓｜技術轉移落地"
    }]
  },
  alternates: {
    canonical: "https://ite.edu.hk/corporate"
  }
};

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "NITTP資助申請流程為何？",
        "acceptedAnswer": { "@type": "Answer", "text": "我們會協助企業處理資助申請手續，課程完成後按計劃申請最高50%資助。" }
      },
      {
        "@type": "Question",
        "name": "課程可於貴機構辦公地點進行嗎？",
        "acceptedAnswer": { "@type": "Answer", "text": "可以，課程可選擇於貴機構場地、網上形式或我們旺角課室進行，班期可彈性安排半日或全日。" }
      },
      {
        "@type": "Question",
        "name": "課程完結後是否提供後續支援？",
        "acceptedAnswer": { "@type": "Answer", "text": "課後提供模板、標準作業程序（SOP），並設短期跟進支援，協助團隊處理落地階段遇到的問題。" }
      },
      {
        "@type": "Question",
        "name": "除企業培訓外，是否設有學界課程？",
        "acceptedAnswer": { "@type": "Answer", "text": "設有，另備中小學AI講座及工作坊，歡迎另行查詢。" }
      }
    ]
  };

  return (
    <>
      {children}
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
