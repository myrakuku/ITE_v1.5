// app/Posts/page.tsx (Server Component)
import { Metadata } from "next";
import Link from "next/link";
import { getPostAdmins } from "../actions/Admin_Post/post-admin";
import Image from "next/image";

export const metadata: Metadata = {
  // Title: 品牌名稱 + 核心內容分類 (建議 60 字元內)
  title: '最新文章與IT培訓資訊 | AI、數據分析與企業轉型 | 宏業教育中心 InnoTrendEDU',
  
  // Description: 精準對應頁面實際的 Blog 主題，強調「實戰」與「數位轉型」(建議 160 字元內)
  description: '探索 InnoTrendEDU 宏業教育中心最新文章與教學資訊。涵蓋 AI 應用工作坊、Python 數據分析、Power BI 自動化報表、網絡安全培訓及 Unity VR 開發等實戰內容，助企業與個人掌握最新科技，推動數位轉型。',
  
  // Keywords: 涵蓋文章中出現的熱門技術與業務關鍵字
  keywords: [
    'ITE最新文章', '宏業教育中心', 'IT培訓資訊', 
    'AI應用教學', 'Python數據分析', 'Power BI自動化', 
    '網絡安全培訓', 'Cybersecurity', 'Unity VR教學', 
    '企業數位轉型', '辦公室自動化'
  ],

  alternates: {
    canonical: 'https://ite.edu.hk/Posts',
  },

  // Open Graph: 針對社群分享優化 (Facebook, LinkedIn, LINE)
  openGraph: {
    title: 'InnoTrendEDU 最新文章 | 掌握 AI、數據分析與網絡安全前沿資訊',
    description: '瀏覽 InnoTrendEDU 宏業教育中心最新科技洞察。從 AI 應用、Power BI 到 Python 數據分析，提供最新企業培訓與個人進修實戰指南。',
    url: 'https://ite.edu.hk/Posts',
    siteName: '宏業教育中心 ITE',
    locale: 'zh_HK',
    type: 'website',
  },
};

export default async function PostsPage() {
  const result = await getPostAdmins({ limit: 20 });

  // 檢查 API 是否成功
  if (!result.success || !result.data) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">最新文章</h1>
        <p className="text-red-500">載入文章失敗，請稍後再試。</p>
      </div>
    );
  }

  // 正確提取 posts 陣列
  const { posts } = result.data;

  // 若無文章，可顯示友好提示
  if (posts.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">最新文章</h1>
        <p className="text-gray-500">目前尚無文章。</p>
      </div>
    );
  }

  return (
  <div className="container mx-auto py-12 px-4">
    <div className="mb-10 max-w-5xl">
      <h1 className="text-2xl font-semibold text-gray-500 mb-3">
        最新文章
      </h1>
      <p className="text-gray-600">
        最新文章涵蓋企業培訓、AI 應用、資安議題及課程資訊，分享實務知識與真實案例。內容拆解企業培訓規劃、AI 落地方法，剖析數碼轉型下的資安風險，協助企業善用 AI 同時保障數據安全。當中亦附上相關課程資訊，方便團隊報讀，在平衡創新與風險管理的同時，提升團隊數碼能力。
      </p>
    </div>

    <div className="grid md:grid-cols-2 gap-x-10 gap-y-12 max-w-5xl">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/Posts/${post.id}`}
          className="group flex flex-col sm:flex-row gap-5 pb-8 border-b border-gray-100 transition-all duration-300 hover:opacity-90"
        >
          {post.img_url && post.img_url.length > 0 && (
            <div className="sm:w-56 flex-shrink-0">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src={post.img_url[0]}
                  alt={post.Title || "文章圖片"}
                  width={640}
                  height={360}
                  className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 220px"
                />
              </div>
            </div>
          )}
          <div className="flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
              <time dateTime={post.createdAt.toISOString()}>
                {new Date(post.createdAt).toLocaleDateString("zh-HK", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {post.author && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                  <span>作者：{post.author}</span>
                </>
              )}
            </div>
            <h2 className="text-md font-semibold text-gray-800 mb-3 group-hover:text-cyan-700 transition-colors leading-snug">
              {post.Title || "無標題"}
            </h2>
            {post.SupTitle && (
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                {post.SupTitle}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  </div>
);


}