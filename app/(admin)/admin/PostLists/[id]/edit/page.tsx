// app/(admin)/admin/PostLists/[id]/edit/page.tsx
import { notFound } from "next/navigation";

import { getPostAdminById } from "@/app/actions/Admin_Post/post-admin";
import PostEditClient from "../../component/[id]/PostEditFormClient";

interface EditPostPageProps {
  params: Promise<{ id: string }>;  // ← 明確標註 params 為 Promise
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  // 正確解包 params（這是必須的步驟）
  const { id: postId } = await params;

  if (!postId) {
    notFound();
  }

  try {
    const result = await getPostAdminById(postId);

    if (!result.success || !result.data) {
      notFound();
    }

    const post = result.data;

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">編輯文章</h1>
        <PostEditClient initialData={post} />
      </div>
    );
  } catch (error: any) {
    console.error("載入編輯頁面失敗:", error);
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">載入失敗</h2>
        <p>無法載入文章資料，請稍後再試或聯絡管理員。</p>
      </div>
    );
  }
}