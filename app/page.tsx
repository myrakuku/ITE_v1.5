// app/page.tsx
import type { Metadata } from "next";
import ShopPage from "@/components/ShopPage"; // 確保正確導入
import { db } from "@/lib/db";

interface HeaderType {
  id: string;
  HeaderTypeName: string;
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const headerTypes = await db.headerType.findMany({
      select: { id: true, HeaderTypeName: true },
    });
    console.log("Home generateMetadata: headerTypes:", headerTypes, "-- End --");
    const keywords = headerTypes.map((ht) => ht.HeaderTypeName).join(", ");
    return {
      title: '宏業教育中心 InnoTrendEDU | 專業AI與IT培訓課程 - 獲NITTP政府資助認可',
      description: '探索 InnoTrendEDU 宏業教育中心的專業課程，涵蓋 AI 人工智能 (Deepseek/GenAI)、Python 編程、Web 全棧開發及網絡安全意識培訓。作為政府認可 NITTP 培訓機構，企業可獲 50% 學費資助。提供公眾課程、企業包班及上門內部培訓服務，助您掌握 InnoHK 創新科技。',
      keywords,
      openGraph: {
        title: '宏業教育中心 InnoTrendEDU | 專業AI與IT培訓課程 - 獲NITTP政府資助認可',
        description: '探索 InnoTrendEDU 宏業教育中心的專業課程，涵蓋 AI 人工智能 (Deepseek/GenAI)、Python 編程、Web 全棧開發及網絡安全意識培訓。作為政府認可 NITTP 培訓機構，企業可獲 50% 學費資助。提供公眾課程、企業包班及上門內部培訓服務，助您掌握 InnoHK 創新科技。',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
        type: "website",
      },
    };
  } catch (error) {
    console.error("獲取 HeaderType 數據失敗:", error);
    return {
      title: '宏業教育中心 InnoTrendEDU | 專業AI與IT培訓課程 - 獲NITTP政府資助認可',
      description: '探索 InnoTrendEDU 宏業教育中心的專業課程，涵蓋 AI 人工智能 (Deepseek/GenAI)、Python 編程、Web 全棧開發及網絡安全意識培訓。作為政府認可 NITTP 培訓機構，企業可獲 50% 學費資助。提供公眾課程、企業包班及上門內部培訓服務，助您掌握 InnoHK 創新科技。',
      keywords: [
        // 品牌與核心
        '宏業教育中心', 'ITE', '香港IT課程', 'InnoHK', 
        // 熱門技術
        'AI課程', 'Deepseek教學', 'Python學校', 'Web AI', 'GenAI',
        // 企業服務
        '企業培訓', '上門包班', '內部培訓', 'Corporate Security Awareness Training', '網絡安全培訓',
        // 資助與認證
        'NITTP資助', '政府認可培訓', '學費資助'
      ],
    };
  }
}


export default async function Home() {
  let headerTypes: HeaderType[] = [];
  try {
    headerTypes = await db.headerType.findMany({
      select: { id: true, HeaderTypeName: true },
    });
    console.log("Home: headerTypes:", headerTypes, "-- End --");
  } catch (error) {
    console.error("獲取 HeaderType 數據失敗:", error);
  }

  return <ShopPage headerTypes={headerTypes} />;
}