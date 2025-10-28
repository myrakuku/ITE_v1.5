// "use server";

// import { prisma } from "@/lib/prisma";
// import { auth, UserRole } from "@/auth";


// interface AddStudentToCourseInput {
//   cartId: string;
//   userId: string;
// }

// interface AddStudentToCourseResult {
//   success: boolean;
//   error?: string;
// }

// export async function addStudentToCourse({
//   cartId,
//   userId,
// }: AddStudentToCourseInput): Promise<AddStudentToCourseResult> {
//   try {
//     // 獲取當前用戶的 session
//     const session = await auth();
//     console.log("session:", session);

//     if (!session?.user?.id) {
//       return { success: false, error: "未授權：請先登入" };
//     }

//     // 驗證 userId 是否與 session.user.id 匹配（除非是 ADMIN）
//     if (session.user.role !== UserRole.ADMIN && userId !== session.user.id) {
//       return { success: false, error: "無權操作：用戶 ID 不匹配" };
//     }

//     // 獲取用戶信息
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { name: true },
//     });

//     if (!user) {
//       return { success: false, error: "找不到用戶" };
//     }

//     const userName = user.name || "匿名用戶";

//     // 獲取購物車中的項目
//     const cart = await prisma.cart.findUnique({
//       where: { id: cartId },
//       include: {
//         items: {
//           include: {
//             product: {
//               select: {
//                 courseId: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!cart || cart.items.length === 0) {
//       return { success: false, error: "購物車為空或不存在" };
//     }

//     // 驗證購物車是否屬於該用戶（除非是 ADMIN）
//     if (session.user.role !== UserRole.ADMIN && cart.userId !== userId) {
//       return { success: false, error: "無權操作：購物車不屬於該用戶" };
//     }

//     // 收集所有需要更新的課程ID
//     const courseUpdates = cart.items
//       .filter(item => item.product.courseId)
//       .map(item => ({
//         courseId: item.product.courseId!,
//         userName
//       }));

//     // 獲取所有相關課程的當前學生列表
//     const courseIds = courseUpdates.map(c => c.courseId);
//     const courses = await prisma.course.findMany({
//       where: { id: { in: courseIds } },
//       select: { id: true, Students: true }
//     });

//     // 創建映射以便快速查找
//     const courseStudentsMap = new Map(
//       courses.map(course => [course.id, course.Students])
//     );

//     // 準備更新操作 - 使用類型斷言確保類型正確
//     const updateOperations = courseUpdates
//       .map(({ courseId, userName }) => {
//         const currentStudents = courseStudentsMap.get(courseId) || [];
        
//         // 如果學生已在名單中，則不添加
//         if (currentStudents.includes(userName)) {
//           return null;
//         }
        
//         return prisma.course.update({
//           where: { id: courseId },
//           data: {
//             Students: {
//               push: userName
//             }
//           }
//         });
//       })
//       .filter((op): op is NonNullable<typeof op> => op !== null); // 關鍵修改

//     // 執行事務
//     if (updateOperations.length > 0) {
//       await prisma.$transaction(updateOperations);
//     }

//     return { success: true };
//   } catch (error) {
//     console.error("添加學生到課程失敗:", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "無法添加學生到課程",
//     };
//   }
// }


"use server";

import { prisma } from "@/lib/prisma";
import { auth} from "@/auth";
import { UserRole } from "@prisma/client";

interface AddStudentToCourseInput {
  cartId: string;
  userId: string;
}

interface AddStudentToCourseResult {
  success: boolean;
  error?: string;
}

export async function addStudentToCourse({
  cartId,
  userId,
}: AddStudentToCourseInput): Promise<AddStudentToCourseResult> {
  try {
    // 獲取當前用戶的 session
    const session = await auth();
    console.log("session:", session);

    if (!session?.user?.id) {
      return { success: false, error: "未授權：請先登入" };
    }

    // 驗證 userId 是否與 session.user.id 匹配（除非是 ADMIN）
    if (session.user.role !== UserRole.ADMIN && userId !== session.user.id) {
      return { success: false, error: "無權操作：用戶 ID 不匹配" };
    }

    // 獲取用戶信息
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (!user) {
      return { success: false, error: "找不到用戶" };
    }

    const userName = user.name || "匿名用戶";

    // 獲取購物車中的項目
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: {
              select: {
                courseId: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return { success: false, error: "購物車為空或不存在" };
    }

    // 驗證購物車是否屬於該用戶（除非是 ADMIN）
    if (session.user.role !== UserRole.ADMIN && cart.userId !== userId) {
      return { success: false, error: "無權操作：購物車不屬於該用戶" };
    }

    // 收集所有需要更新的課程ID
    const courseUpdates = cart.items
      .filter(item => item.product.courseId)
      .map(item => ({
        courseId: item.product.courseId!,
        userName,
      }));

    // 獲取所有相關課程的當前學生列表和人數上限
    const courseIds = courseUpdates.map(c => c.courseId);
    const courses = await prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: { id: true, Students: true, maxStudents: true },
    });

    // 檢查 specialCourse 的學生數量和人數上限
    const specialCourses = await prisma.specialCourse.findMany({
      where: { id: { in: courseIds } },
      select: { id: true, Students: true, maxStudents: true },
    });

    // 創建映射以便快速查找課程和特殊課程
    const courseStudentsMap = new Map(
      courses.map(course => [course.id, { students: course.Students, maxStudents: course.maxStudents }])
    );
    const specialCourseStudentsMap = new Map(
      specialCourses.map(course => [course.id, { students: course.Students, maxStudents: course.maxStudents }])
    );

    // 檢查人數上限
    for (const { courseId, userName } of courseUpdates) {
      const courseData = courseStudentsMap.get(courseId);
      const specialCourseData = specialCourseStudentsMap.get(courseId);

      const currentStudents = courseData?.students || specialCourseData?.students || [];
      const maxStudents = courseData?.maxStudents || specialCourseData?.maxStudents;

      // 如果學生已在名單中，則跳過檢查
      if (currentStudents.includes(userName)) {
        continue;
      }

      // 檢查人數上限（如果 maxStudents 已定義）
      if (maxStudents !== null && maxStudents !== undefined && currentStudents.length >= maxStudents) {
        return { success: false, error: `課程 ${courseId} 已滿人，無法添加更多學生` };
      }
    }

    // 準備更新操作
    const updateOperations = courseUpdates
      .map(({ courseId, userName }) => {
        const courseData = courseStudentsMap.get(courseId);
        const specialCourseData = specialCourseStudentsMap.get(courseId);

        const currentStudents = courseData?.students || specialCourseData?.students || [];

        // 如果學生已在名單中，則不添加
        if (currentStudents.includes(userName)) {
          return null;
        }

        // 判斷是更新 Course 還是 specialCourse
        if (courseData) {
          return prisma.course.update({
            where: { id: courseId },
            data: {
              Students: {
                push: userName,
              },
            },
          });
        } else if (specialCourseData) {
          return prisma.specialCourse.update({
            where: { id: courseId },
            data: {
              Students: {
                push: userName,
              },
            },
          });
        }
        return null;
      })
      .filter((op): op is NonNullable<typeof op> => op !== null);

    // 執行事務
    if (updateOperations.length > 0) {
      await prisma.$transaction(updateOperations);
    }

    return { success: true };
  } catch (error) {
    console.error("添加學生到課程失敗:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "無法添加學生到課程",
    };
  }
}