
"use server";

import { db } from "@/lib/db";

export async function deleteHeaderType(id: string) {
  if (!id) {
    throw new Error("缺少 id 參數");
  }

  try {
    const statue = await db.headerType.findUnique({
      where: { id },
    });

    if (!statue) {
      throw new Error("未找到指定的關鍵字");
    }

    await db.headerType.delete({
      where: { id },
    });

    return { message: `成功刪除關鍵字: ${id}` };
  } catch (error) {
    console.error("刪除關鍵字時發生錯誤:", error);
    throw new Error("伺服器錯誤，無法刪除關鍵字");
  } finally {
    await db.$disconnect();
  }
}