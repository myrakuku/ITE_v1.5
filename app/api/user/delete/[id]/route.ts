// app/api/user/delete/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "未授權，僅管理員可刪除" }, { status: 401 });
  }

  if (id === session.user.id) {
    return NextResponse.json({ error: "不能刪除自己的帳號" }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. 先刪除所有相關的關聯數據
      await tx.invoice.deleteMany({ where: { userId: id } });
      await tx.receipt.deleteMany({ where: { userId: id } });
      await tx.accounts.deleteMany({ where: { client_id: id } });
      await tx.order.deleteMany({ where: { userId: id } });
      await tx.cart.deleteMany({ where: { userId: id } });
      await tx.session.deleteMany({ where: { userId: id } });
      await tx.account.deleteMany({ where: { userId: id } });
      await tx.oAuth.deleteMany({ where: { userId: id } });
      
      // 2. 處理 PaymentMethods_price
      await tx.paymentMethods_price.deleteMany({
        where: { Invoice: { some: { userId: id } } }
      });
      
      // 3. 處理 Product 相關數據 - 修正關聯字段名稱
      // 從您的 schema 看，Product 和 Course 的關聯字段是 course（小寫）
      await tx.product_Course_Dates.deleteMany({
        where: { product: { Course: { teacherId: id } } }
      });
      
      await tx.product_Course_Time_Ranges.deleteMany({
        where: { product: { Course: { teacherId: id } } }
      });
      
      await tx.product_Img.deleteMany({
        where: { Product: { Course: { teacherId: id } } }
      });
      
      await tx.product_video.deleteMany({
        where: { Product: { Course: { teacherId: id } } }
      });
      
      // 4. 刪除 Product（如果用戶是課程的創建者）
      await tx.product.deleteMany({
        where: { Course: { teacherId: id } }
      });
      
      // 5. specialCourse 的 Students 是 String[]，需要正確處理
      // 從 schema 看，specialCourse 中的 Students 是 User[] 關係
      // 我們需要先找到包含該用戶的 specialCourse
      const specialCoursesWithStudent = await tx.specialCourse.findMany({
        where: {
          Students: {
            some: { id: id }
          }
        },
        select: { id: true }
      });
      
      // 然後逐一移除該用戶
      for (const course of specialCoursesWithStudent) {
        await tx.specialCourse.update({
          where: { id: course.id },
          data: {
            Students: {
              disconnect: { id: id }
            }
          }
        });
      }
      
      // 6. 處理 specialCourse 相關的時間範圍
      await tx.specialCourseTimeRange.deleteMany({
        where: { course: { teacherId: id } }
      });
      
      // 7. 刪除 specialCourse（用戶創建的）
      await tx.specialCourse.deleteMany({
        where: { teacherId: id }
      });
      
      // 8. 處理 Course 相關
      await tx.courseTimeRange.deleteMany({
        where: { course: { teacherId: id } }
      });
      
      await tx.course.deleteMany({ where: { teacherId: id } });
      
      // 9. CourseModul
      await tx.courseModul.deleteMany({ where: { TeacherId: id } });
      
      // 10. 處理 GroupUser 和 GroupMember
      // GroupUser.Groupmember 是 String[]，需要使用 array_contains 查詢
      const groupUsers = await tx.groupUser.findMany({
        where: {
          Groupmember: {
            has: id // 這裡的 has 應該可用於 String[]
          }
        }
      });
      
      // 更新 GroupUser，移除該用戶
      for (const group of groupUsers) {
        const updatedMembers = group.Groupmember.filter(memberId => memberId !== id);
        await tx.groupUser.update({
          where: { id: group.id },
          data: { Groupmember: updatedMembers }
        });
      }
      
      // GroupMember 需要根據實際情況處理
      // 如果 GroupMember.username 存的是用戶 ID
      await tx.groupMember.deleteMany({
        where: { username: id }
      });
      
      // 如果 GroupMember.username 存的是用戶名，則需要先獲取用戶名
      const userToDelete = await tx.user.findUnique({
        where: { id },
        select: { username: true }
      });
      
      if (userToDelete?.username) {
        await tx.groupMember.deleteMany({
          where: { username: userToDelete.username }
        });
      }
      
      // 11. 處理其他可能的關聯
      // 檢查是否有其他表引用此用戶
      await tx.message_Box.deleteMany({
        where: {
          OR: [
            { sender: id },
            { receiver: id }
          ]
        }
      });
      
      // 12. 最後：安全刪除 User
      await tx.user.delete({ where: { id } });
    });

    return NextResponse.json({
      success: true,
      message: "用戶及其所有相關資料已完全刪除"
    });
  } catch (error: any) {
    console.error("刪除用戶失敗:", error);
    
    // 提供更詳細的錯誤信息
    const errorMessage = error.message || "未知錯誤";
    
    return NextResponse.json({
      error: "刪除失敗，請聯繫開發者",
      details: process.env.NODE_ENV === "development" ? errorMessage : undefined
    }, { status: 500 });
  }
}