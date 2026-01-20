// app/admin/posts/new/page.tsx (Server Component)

import { auth } from "@/auth"; // 需要創建 auth 配置
import { redirect } from "next/navigation";
import PostFormClient from "../component/PostFormClient";


export default async function NewPostPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/admin"); // 或顯示錯誤
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">建立新文章</h1>
      <PostFormClient />
    </div>
  );
}