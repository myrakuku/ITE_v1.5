// app/(admin)/admin/PostLists/[id]/component/PostDetailClient.tsx ("use client")
"use client";

import { useRouter } from "next/navigation";
import { deletePostAdmin } from "@/app/actions/Admin_Post/post-admin";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface PostDetailClientProps {
  post: {
    id: string;
    Title: string | null;
    SupTitle: string | null;
    content: string | null;
    createdAt: Date;
    updatedAt: Date;
    img_url: string[];
    video_url: string[];
    author: string | null;
  };
}

export default function PostDetailClient({ post }: PostDetailClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  console.log("data by Id: ", post , "-- End --")
  const handleDelete = async () => {
    if (!confirm("確定永久刪除此文章？")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await deletePostAdmin(post.id);
      router.push("/admin/PostLists");
    } catch (error) {
      console.error("刪除失敗:", error);
      alert("刪除失敗，請稍後再試");
    } finally {
      setIsDeleting(false);
    }
  };

  // 格式化日期函數
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  if (!post) {
    return <div className="p-6">文章不存在或載入中...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">文章詳細資料</h1>
        <Link 
          href="/admin/PostLists" 
          className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          返回列表
        </Link>
      </div>

      <div className="space-y-6">
        {/* 基本資訊 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">基本資訊</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">文章ID</label>
                <p className="mt-1 text-gray-900 font-mono text-sm">{post.id}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">標題</label>
                <p className="mt-1 text-gray-900 text-lg font-semibold">
                  {post.Title || <span className="text-gray-400">(無標題)</span>}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">副標題</label>
                <p className="mt-1 text-gray-900">
                  {post.SupTitle || <span className="text-gray-400">(無副標題)</span>}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">作者</label>
                <p className="mt-1 text-gray-900">
                  {post.author || <span className="text-gray-400">未知</span>}
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">時間資訊</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">建立時間</label>
                <p className="mt-1 text-gray-900">{formatDate(new Date(post.createdAt))}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500">最後更新</label>
                <p className="mt-1 text-gray-900">{formatDate(new Date(post.updatedAt))}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 內容 */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-700">文章內容</h2>
          <div className="bg-gray-50 rounded p-4 min-h-[200px]">
            {post.content ? (
              <div className="whitespace-pre-wrap text-gray-900">{post.content}</div>
            ) : (
              <p className="text-gray-400">(無內容)</p>
            )}
          </div>
        </div>

        {/* 圖片 */}
        {post.img_url && post.img_url.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">圖片 ({post.img_url.length}張)</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {post.img_url.map((url, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={url}
                    alt={`文章圖片 ${index + 1}`}
                    className="w-full h-40 object-cover rounded border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="truncate block">
                      {url}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 影片 */}
        {post.video_url && post.video_url.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-700">影片 ({post.video_url.length}個)</h2>
            <div className="space-y-3">
              {post.video_url.map((url, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-500 rounded flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <a 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate block"
                    >
                      {url}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 操作按鈕 */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Link
            href={`/admin/PostLists/${post.id}/edit`}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            編輯文章
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "刪除中..." : "刪除文章"}
          </button>
        </div>
      </div>
    </div>
  );
}