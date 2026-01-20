// app/(admin)/admin/PostLists/page.tsx
import { getPostAdmins } from "@/app/actions/Admin_Post/post-admin";
import PostListClient from "./component/PostListClient";

interface AdminPostsPageProps {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}

export default async function AdminPostsPage({ searchParams }: AdminPostsPageProps) {
  try {
    // 等待 searchParams Promise 解析
    const params = await searchParams;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const search = params.search || "";

    // 獲取文章資料
    const result = await getPostAdmins({ page, limit, search });

    // 檢查結果是否成功
    if (!result.success) {
      console.error("獲取文章列表失敗:", result.error);
      return (
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">文章管理</h1>
          <div className="text-red-600">載入文章失敗: {result.error}</div>
        </div>
      );
    }

    const { posts, total } = result.data;

    // 在伺服器端格式化日期
    const formattedPosts = posts.map(post => ({
      ...post,
      formattedCreatedAt: post.formattedCreatedAt || `${post.createdAt.getFullYear()}/${String(post.createdAt.getMonth() + 1).padStart(2, '0')}/${String(post.createdAt.getDate()).padStart(2, '0')}`
    }));

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">文章管理</h1>
        <PostListClient 
          posts={formattedPosts} 
          total={total} 
          page={page} 
          limit={limit} 
          search={search} 
        />
      </div>
    );
  } catch (error: any) {
    console.error("頁面載入失敗:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">文章管理</h1>
        <div className="text-red-600">載入頁面時發生錯誤: {error.message}</div>
      </div>
    );
  }
}