// app/(admin)/admin/PostLists/component/PostListClient.tsx ("use client")
"use client";

import { deletePostAdmin } from "@/app/actions/Admin_Post/post-admin";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface PostListClientProps {
  posts: any[];
  total: number;
  page: number;
  limit: number;
  search: string;
}

export default function PostListClient({ posts, total, page, limit, search }: PostListClientProps) {
  const router = useRouter();
  // const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

const handleDelete = async (id: string) => {
  if (!confirm("確定刪除此文章？")) return;

  setIsDeleting(id);
  try {
    await deletePostAdmin(id);
    // 若伺服器未重定向，這裡可作為後備
    router.refresh();
    router.push("/admin/PostLists");
  } catch (error: any) {
    console.error("刪除失敗:", error);
    // alert(`刪除失敗: ${error.message || "請稍後再試"}`);
  } finally {
    setIsDeleting(null);
  }
};

  const totalPages = Math.ceil(total / limit);

  // 分頁導航
  const navigateToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    
    const params = new URLSearchParams();
    if (newPage > 1) params.set('page', newPage.toString());
    if (limit !== 10) params.set('limit', limit.toString());
    if (search) params.set('search', search);
    
    const queryString = params.toString();
    router.push(`/admin/PostLists${queryString ? `?${queryString}` : ''}`);
  };

  // 處理搜尋
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchTerm = formData.get('search') as string;
    
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (page > 1) params.set('page', page.toString());
    if (limit !== 10) params.set('limit', limit.toString());
    
    router.push(`/admin/PostLists?${params.toString()}`);
  };

  console.log("Data : ", posts, "-- End --");

  if (!posts || posts.length === 0) {
    return (
      <div>
        <div className="mb-4">
          <Link href="/admin/PostLists/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            新增文章
          </Link>
        </div>
        <div className="text-center py-8 text-gray-500">
          目前沒有文章
        </div>
        
        {/* 搜尋功能 */}
        <div className="mt-4">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="搜尋文章..."
              className="px-3 py-1 border rounded"
            />
            <button type="submit" className="ml-2 px-3 py-1 bg-blue-600 text-white rounded">
              搜尋
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Link href="/admin/PostLists/new" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          新增文章
        </Link>
        <div className="text-sm text-gray-600">
          共 {total} 篇文章，第 {page} 頁 / 共 {totalPages} 頁
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">標題</th>
              <th className="border p-2 text-left">作者</th>
              <th className="border p-2 text-left">建立時間</th>
              <th className="border p-2 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post: any) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="border p-2">{post.Title || "(無標題)"}</td>
                <td className="border p-2">{post.author || "未知"}</td>
                <td className="border p-2">{post.formattedCreatedAt}</td>
                <td className="border p-2">
                  <Link 
                    href={`/admin/PostLists/${post.id}`}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    檢視/編輯
                  </Link>
                  <button 
                    onClick={() => handleDelete(post.id)} 
                    disabled={isDeleting === post.id}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    {isDeleting === post.id ? "刪除中..." : "刪除"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分頁控制 */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => navigateToPage(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            上一頁
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => navigateToPage(pageNum)}
                  className={`px-3 py-1 border rounded ${
                    page === pageNum 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => navigateToPage(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            下一頁
          </button>
        </div>
      )}

      {/* 搜尋功能 */}
      <div className="mt-4">
        <form onSubmit={handleSearch} className="flex items-center">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="搜尋文章..."
            className="flex-1 px-3 py-1 border rounded"
          />
          <button 
            type="submit" 
            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            搜尋
          </button>
          {search && (
            <button
              type="button"
              onClick={() => router.push('/admin/PostLists')}
              className="ml-2 px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              清除搜尋
            </button>
          )}
        </form>
      </div>
    </div>
  );
}