// app/(admin)/admin/PostLists/[id]/page.tsx
import { getPostAdminById } from "@/app/actions/Admin_Post/post-admin";

import { notFound } from "next/navigation";
import PostDetailClient from "../component/[id]/PostDetailClient";

interface AdminPostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminPostDetailPage({ params }: AdminPostDetailPageProps) {
  try {
    // 等待 params Promise 解析
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    console.log("詳細頁面 - 文章 ID:", id);
    
    // 驗證 id
    if (!id || typeof id !== 'string') {
      console.log("詳細頁面 - 無效的 ID");
      return notFound();
    }
    
    // 獲取文章資料
    const result = await getPostAdminById(id);
    console.log("詳細頁面 - 獲取結果:", result);
    
    // 檢查結果是否成功
    if (!result.success || !result.data) {
      console.log("詳細頁面 - 文章不存在");
      return notFound();
    }
    
    const post = result.data;
    
    // 確保傳遞正確的資料格式
    const postData = {
      id: post.id,
      Title: post.Title,
      SupTitle: post.SupTitle,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      img_url: post.img_url || [],
      video_url: post.video_url || [],
      author: post.author,
    };
    
    console.log("詳細頁面 - 傳遞給客戶端的資料:", postData);
    
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">文章詳細資料</h1>
        <PostDetailClient post={postData} />
      </div>
    );
  } catch (error: any) {
    console.error("詳細頁面錯誤:", error);
    if (error.message === "文章不存在" || error.message === "無效的文章 ID") {
      return notFound();
    }
    throw error;
  }
}