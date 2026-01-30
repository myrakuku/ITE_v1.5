// app/posts/[id]/page.tsx
import { getPostAdminById } from "@/app/actions/Admin_Post/post-admin";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;

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

      {/* 文章內容 */}
      <div className="mt-8">
        <div
          className="whitespace-pre-wrap prose-p:my-4 prose-ul:my-4 prose-ol:my-4"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />
        {!post.content && (
          <p className="text-gray-500 italic">本文尚未填寫內容</p>
        )}
      </div>

      {/* 新增：相關課程區塊 */}
      <div className="mt-12">
        <h3 className="text-2xl font-semibold mb-4 text-white">相關課程</h3>
        {post.relatedCourses?.trim() ? (
          <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 whitespace-pre-wrap leading-relaxed">
            {post.relatedCourses.split('\n').map((line, index) => (
              <p key={index} className="mb-2">
                {line.trim().startsWith('http') ? (
                  <a
                    href={line.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {line.trim()}
                  </a>
                ) : (
                  line
                )}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">
            尚未提供相關課程資訊
          </p>
        )}
      </div>

      {/* 圖片渲染 */}
      {post.img_url && post.img_url.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-12">
          {post.img_url.map((url, index) => (
            <Image
              key={index}
              src={url}
              alt={`${post.Title} - 圖片 ${index + 1}`}
              className="rounded-lg shadow-lg object-cover w-full h-auto"
              width={800}
              height={600}
            />
          ))}
        </div>
      )}

      {/* 影片渲染 */}
      {post.video_url && post.video_url.length > 0 && (
        <div className="space-y-8 my-12">
          {post.video_url.map((url, index) => (
            <div key={index} className="aspect-video">
              {url.includes("youtube.com") || url.includes("youtu.be") ? (
                <iframe
                  src={url
                    .replace("watch?v=", "embed/")
                    .replace("youtu.be/", "www.youtube.com/embed/")}
                  title={`影片 ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg shadow-lg"
                />
              ) : (
                <video controls className="w-full h-full rounded-lg shadow-lg">
                  <source src={url} />
                  您的瀏覽器不支援影片播放。
                </video>
              )}
            </div>
          ))}
        </div>
      )}

      {post.author && (
        <p className="text-sm text-gray-500 mt-12">
          作者：{post.author}
        </p>
      )}

      {/* 可選：顯示建立/更新時間 */}
      <p className="text-sm text-gray-500 mt-4">
        最後更新：{new Date(post.updatedAt).toLocaleString("zh-TW")}
      </p>
    </article>
  );
}