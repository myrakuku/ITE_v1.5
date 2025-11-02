"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

interface AddStudentToAllCoursesInput {
  cartId: string;
  userId: string;
}

interface AddStudentToAllCoursesResult {
  success: boolean;
  error?: string;
  details?: {
    coursesUpdated: number;
    specialCoursesUpdated: number;
  };
}

// 統一的 Server Action，同時處理 Course 和 specialCourse
export async function addStudentToAllCourses({
  cartId,
  userId,
}: AddStudentToAllCoursesInput): Promise<AddStudentToAllCoursesResult> {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: "未授權：請先登入" };
    }

    if (session.user.role !== UserRole.ADMIN && userId !== session.user.id) {
      return { success: false, error: "無權操作：用戶 ID 不匹配" };
    }

    // 獲取用戶信息（用於 Course 的字符串數組）
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (!user) {
      return { success: false, error: "找不到用戶" };
    }

    // const userName = user.name || "匿名用戶";

    // 獲取購物車
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: {
              select: {
                courseId: true,
                specialCourse: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return { success: false, error: "購物車為空或不存在" };
    }

    if (session.user.role !== UserRole.ADMIN && cart.userId !== userId) {
      return { success: false, error: "無權操作：購物車不屬於該用戶" };
    }

    // 分離 Course 和 specialCourse
    const courseItems = cart.items.filter(item => item.product.courseId);
    const specialCourseItems = cart.items.filter(item => item.product.specialCourse);

    let coursesUpdated = 0;
    let specialCoursesUpdated = 0;

    // 處理 Course（字符串數組）
    if (courseItems.length > 0) {
      const courseResult = await addStudentToAllCourses({ cartId, userId });
      if (courseResult.success) {
        coursesUpdated = courseItems.length;
      } else {
        return { success: false, error: courseResult.error };
      }
    }

    // 處理 specialCourse（User 關係）
    if (specialCourseItems.length > 0) {
      const specialCourseResult = await addStudentToAllCourses({ cartId, userId });
      if (specialCourseResult.success) {
        specialCoursesUpdated = specialCourseItems.length;
      } else {
        return { success: false, error: specialCourseResult.error };
      }
    }

    return {
      success: true,
      details: {
        coursesUpdated,
        specialCoursesUpdated,
      },
    };
  } catch (error) {
    console.error("添加學生到所有課程失敗:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "無法添加學生到課程",
    };
  }
}