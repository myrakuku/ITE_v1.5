// app/actions/Delete/delete-special-course.ts
"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteSpecialCourse(id: string) {
  try {
    const course = await db.specialCourse.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!course) {
      return { error: "課程不存在" };
    }

    await db.specialCourse.delete({
      where: { id },
    });

    revalidatePath("/admin/SpecialCourseLists");
    revalidatePath("/specialCourse/[id]");

    return { success: true };
  } catch (error) {
    console.error("刪除特殊課程失敗:", error);
    return { error: "刪除失敗，請稍後再試" };
  }
}