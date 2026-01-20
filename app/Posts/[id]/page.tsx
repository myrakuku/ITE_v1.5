// app/posts/[id]/page.tsx (修正後版本)

import { getPostAdminById } from "@/app/actions/Admin_Post/post-admin";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>; // 明確標記為 Promise
}

export default async function PostDetailPage({ params }: Props) {
  // 必須先 await params 才能存取 id
  const { id } = await params;

  // 額外安全驗證（雖然 getPostAdminById 已內建）
  if (!id || typeof id !== "string") {
    notFound();
  }

  let result;
  try {
    result = await getPostAdminById(id);
  } catch (error) {
    console.error("載入文章失敗:", error);
    notFound();
  }

  if (!result.success || !result.data) {
    notFound();
  }

  const post = result.data;

return (
  <article className="container mx-auto py-8 prose max-w-3xl prose-invert">
    <h1 className="text-3xl font-bold mb-4">{post.Title || "無標題"}</h1>

<div className="mb-6">
      <Link href="/Posts" className="text-blue-500 hover:underline">
        ← 返回文章列表
      </Link>
    </div>

    {post.SupTitle && (
      <h2 className="text-xl text-gray-400 mb-6">{post.SupTitle}</h2>
    )}

    {/* 關鍵修正：添加 whitespace-pre-wrap */}
    <div
      className="mt-8 whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: post.content || "" }}
    />

    {/* 其餘部分不變 */}
    {/* 圖片渲染 */}
    {post.img_url && post.img_url.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
        {post.img_url.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`${post.Title} - 圖片 ${index + 1}`}
            className="rounded-lg shadow-lg object-cover w-full h-auto"
          />
        ))}
      </div>
    )}

    {/* 影片渲染 */}
    {post.video_url && post.video_url.length > 0 && (
      <div className="space-y-6 my-8">
        {post.video_url.map((url, index) => (
          <div key={index} className="aspect-video">
            {url.includes("youtube.com") || url.includes("youtu.be") ? (
              <iframe
                src={url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                title={`影片 ${index + 1}`}
                allowFullScreen
                className="w-full h-full rounded-lg"
              />
            ) : (
              <video controls className="w-full h-full rounded-lg">
                <source src={url} />
                您的瀏覽器不支援影片播放。
              </video>
            )}
          </div>
        ))}
      </div>
    )}

    {post.author && (
      <p className="text-sm text-gray-500 mt-8">作者：{post.author}</p>
    )}
  </article>
);
}