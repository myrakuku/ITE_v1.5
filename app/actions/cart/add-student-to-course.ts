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

// === 處理 Course：Students 是 String[]，push user.name ===
async function addStudentToCourses(
  cartId: string,
  userName: string
): Promise<number> {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        where: {
          product: {
            courseId: { not: null },
          },
        },
        include: {
          product: {
            select: { courseId: true },
          },
        },
      },
    },
  });

  if (!cart?.items.length) return 0;

  const courseIds = cart.items
    .map((item) => item.product.courseId)
    .filter((id): id is string => !!id);

  if (courseIds.length === 0) return 0;

  // 逐個更新課程
  const updatePromises = courseIds.map(courseId => 
    prisma.course.update({
      where: { id: courseId },
      data: {
        Students: {
          push: userName,
        },
      },
    })
  );

  await Promise.all(updatePromises);
  return courseIds.length;
}

// === 處理 specialCourse：通過關係查詢 ===
async function addStudentToSpecialCourses(
  cartId: string,
  userId: string
): Promise<number> {
  // 首先獲取購物車中所有關聯 specialCourse 的產品
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          product: {
            include: {
              specialCourse: {
                select: { id: true },
              },
            },
          },
        },
      },
    },
  });

  if (!cart?.items.length) return 0;

  // 提取所有 specialCourse 的 ID
const specialCourseIds = cart.items
  .flatMap((item) => item.product.specialCourse ?? []) // 展开 specialCourse 数组
  .map(sc => sc.id); // 提取每个对象的 id
  if (specialCourseIds.length === 0) return 0;

  // 逐個更新特殊課程
  const updatePromises = specialCourseIds.map(specialCourseId =>
    prisma.specialCourse.update({
      where: { id: specialCourseId },
      data: {
        Students: {
          connect: { id: userId },
        },
      },
    })
  );

  await Promise.all(updatePromises);
  return specialCourseIds.length;
}

// === 主函數：統籌兩者 ===
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

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });

    if (!user) {
      return { success: false, error: "找不到用戶" };
    }

    const userName = user.name || "匿名用戶";

    // 驗證購物車存在且屬於該用戶
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: {
              select: {
                courseId: true,
                specialCourse: {
                  select: { id: true },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return { success: false, error: "購物車不存在" };
    }

    if (cart.items.length === 0) {
      return { success: false, error: "購物車為空" };
    }

    if (session.user.role !== UserRole.ADMIN && cart.userId !== userId) {
      return { success: false, error: "無權操作：購物車不屬於該用戶" };
    }

    let coursesUpdated = 0;
    let specialCoursesUpdated = 0;

    // 執行兩種更新
    coursesUpdated = await addStudentToCourses(cartId, userName);
    specialCoursesUpdated = await addStudentToSpecialCourses(cartId, userId);

    console.log(`[addStudent] Course 更新: ${coursesUpdated} 筆`);
    console.log(`[addStudent] specialCourse 更新: ${specialCoursesUpdated} 筆`);

    if (coursesUpdated === 0 && specialCoursesUpdated === 0) {
      return { success: false, error: "沒有找到需要添加的課程" };
    }

    return {
      success: true,
      details: { coursesUpdated, specialCoursesUpdated },
    };
  } catch (error) {
    console.error("添加學生到所有課程失敗:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "無法添加學生到課程",
    };
  }
}