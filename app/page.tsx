
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
      title: "ITE - 課程商店",
      description: `探索我們的課程：${keywords}`,
      keywords,
      openGraph: {
        title: "ITE - 課程商店",
        description: `探索我們的課程：${keywords}`,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
        type: "website",
      },
    };
  } catch (error) {
    console.error("獲取 HeaderType 數據失敗:", error);
    return {
      title: "ITE - 課程商店",
      description: "探索 ITE 的優質課程",
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