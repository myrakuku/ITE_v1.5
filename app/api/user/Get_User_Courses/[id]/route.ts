// "use server";

// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import getServerSession from "next-auth"
// import { authOptions } from "@/auth";
// import { Session } from "next-auth"; // 匯入 Session 型別

// interface CourseWithDetails {
//   id: string;
//   title: string;
//   description: string;
//   courseCode: string;
//   schoolName: string;
//   Students: string[];
//   teacherId: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// interface ErrorResponse {
//   error: string;
//   statusCode?: number;
// }

// // 明確定義自定義 Session 型別（與 auth.ts 一致）
// interface CustomSession extends Session {
//   user: {
//     id: string;
//     name: string | null;
//     role: string; // UserRole 會被序列化為 string
//     email: string | null;
//     emailVerified: Date | null;
//   };
// }

// export async function GET(req: NextRequest): Promise<NextResponse<CourseWithDetails[] | ErrorResponse>> {
//   try {
//     const session = await getServerSession(authOptions) as CustomSession | null;
//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "未授權：請先登入" },
//         { status: 401 }
//       );
//     }

//     const userId = session.user.id;

//     // 獲取用戶的 name
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       select: { name: true },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "找不到用戶" }, { status: 404 });
//     }

//     const userName = user.name || "匿名用戶";

//     // 查詢用戶作為教師的課程（通過 teacherId）
//     const teacherCourses = await prisma.course.findMany({
//       where: { teacherId: userId },
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         courseCode: true,
//         schoolName: true,
//         Students: true,
//         teacherId: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     // 查詢用戶作為學生的課程（通過 Students 字段）
//     const studentCourses = await prisma.course.findMany({
//       where: { Students: { has: userName } },
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         courseCode: true,
//         schoolName: true,
//         Students: true,
//         teacherId: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     // 合併並去重課程（避免教師和學生的課程重複）
//     const uniqueCourses = [
//       ...teacherCourses,
//       ...studentCourses.filter(
//         (sc) => !teacherCourses.some((tc) => tc.id === sc.id)
//       ),
//     ];

//     return NextResponse.json(uniqueCourses);
//   } catch (error) {
//     console.error("獲取用戶課程失敗:", error);
//     return NextResponse.json(
//       {
//         error: error instanceof Error ? error.message : "無法獲取用戶課程",
//         statusCode: 500,
//       },
//       { status: 500 }
//     );
//   }
// }

"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

interface CourseWithDetails {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  Students: string[];
  teacherId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ErrorResponse {
  error: string;
  statusCode?: number;
}

interface CustomSession {
  user: {
    id: string;
    name: string | null;
    role: UserRole;
    email: string | null;
    emailVerified: Date | null;
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params:  Promise<{ id: string } >} // 关键修改
): Promise<NextResponse<CourseWithDetails[] | ErrorResponse>> {
  try {
    // 直接从 params 获取 userId
    const {id:userId} =await params; // 关键修改
    if (!userId) {
      return NextResponse.json(
        { error: "缺少用戶 ID", statusCode: 400 },
        { status: 400 }
      );
    }

    const sessionData = await auth();
    const session = sessionData as unknown as CustomSession | null;

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "未授權：請先登入" },
        { status: 401 }
      );
    }

    if (session.user.role !== UserRole.ADMIN && session.user.id !== userId) {
      return NextResponse.json(
        { error: "無權操作：您無權查看其他用戶的課程" },
        { status: 403 }
      );
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { error: "無效的用戶 ID 格式", statusCode: 400 },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "找不到用戶", statusCode: 404 }, { status: 404 });
    }

    const userName = user.name || "匿名用戶";

    const teacherCourses = await prisma.course.findMany({
      where: { teacherId: userId },
      select: {
        id: true,
        title: true,
        description: true,
        courseCode: true,
        schoolName: true,
        Students: true,
        teacherId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const studentCourses = await prisma.course.findMany({
      where: { Students: { has: userName } },
      select: {
        id: true,
        title: true,
        description: true,
        courseCode: true,
        schoolName: true,
        Students: true,
        teacherId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const uniqueCourses = [
      ...teacherCourses,
      ...studentCourses.filter(
        (sc) => !teacherCourses.some((tc) => tc.id === sc.id)
      ),
    ];

    return NextResponse.json(uniqueCourses);
  } catch (error) {
    console.error("獲取用戶課程失敗:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "無法獲取用戶課程",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}