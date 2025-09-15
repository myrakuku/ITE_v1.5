import { NextRequest, NextResponse } from "next/server";
import { createOssClient } from "@/lib/oss-client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    console.log("Session:", session);

    if (!session || !session.user || !["TEACHER", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ success: false, message: "無權限刪除教材" }, { status: 403 });
    }

    const body = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));
    const { materialId } = body;

    if (!materialId) {
      return NextResponse.json({ success: false, message: "缺少教材 ID" }, { status: 400 });
    }

    const courseModule = await prisma.courseModul.findUnique({
      where: { id: materialId },
    });

    console.log("Course Module:", courseModule);

    if (!courseModule) {
      return NextResponse.json({ success: false, message: "教材不存在" }, { status: 404 });
    }

    if (session.user.id !== courseModule.TeacherId && session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "無權限刪除此教材" }, { status: 403 });
    }

    // 刪除 OSS 文件（如果存在）
    if (courseModule.Teaching_Materials) {
      const objectKey = courseModule.Teaching_Materials.split(
        "ite-teacher-fold.oss-cn-hongkong.aliyuncs.com/"
      )[1];
      console.log("ObjectKey to delete:", objectKey);
      if (objectKey) {
        const ossClient = createOssClient();
        await ossClient.delete(objectKey);
        console.log("OSS file deleted:", objectKey);
      }
    }

    // 刪除資料庫中的 CourseModul 記錄
    await prisma.courseModul.delete({
      where: { id: materialId },
    });

    console.log("CourseModul deleted:", materialId);

    return NextResponse.json({ success: true, message: "教材和相關文件已成功刪除" });
  } catch (error) {
    console.error("刪除教材失敗:", error, JSON.stringify(error, null, 2));
    const errorMessage = error instanceof Error ? error.message : "刪除教材失敗";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}