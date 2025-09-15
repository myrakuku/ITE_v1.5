
"use server";

import { db } from "@/lib/db";

export async function deleteStatue(id: string) {
  if (!id) {
    throw new Error("缺少 id 參數");
  }

  try {
    const statue = await db.courseProductStatus.findUnique({
      where: { id },
    });

    if (!statue) {
      throw new Error("未找到指定的狀態");
    }

    await db.courseProductStatus.delete({
      where: { id },
    });

    return { message: `成功刪除狀態: ${id}` };
  } catch (error) {
    console.error("刪除狀態時發生錯誤:", error);
    throw new Error("伺服器錯誤，無法刪除狀態");
  } finally {
    await db.$disconnect();
  }
}