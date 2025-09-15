// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export async function GET(req: NextRequest) {
//   try {
//     const courses = await db.course.findMany({
//       include: {
//         CourseTimeRanges: true, // 包含 CourseTimeRanges
//       },
//     });
//     return NextResponse.json(courses);
//   } catch (error) {
//     console.error("GetCourseLists error: ", error);
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : "獲取課程列表失敗" },
//       { status: 500 }
//     );
//   }
// }


"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // 假設使用 prisma 而非 db
import { Course } from "@prisma/client";

// 定義與 select 匹配的 CourseTimeRange 型別
interface SelectedCourseTimeRange {
  id: string;
  timeRange: string;
  starttime: string | null; // 修正為 camelCase
  endtime: string | null; // 修正為 camelCase
}

interface CourseWithTimeRanges extends Course {
  CourseTimeRanges: SelectedCourseTimeRange[];
}

// 定義錯誤回應的型別
interface ErrorResponse {
  error: string;
  statusCode?: number;
}

export async function GET(req: NextRequest): Promise<NextResponse<CourseWithTimeRanges[] | ErrorResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const typeId = searchParams.get("typeId");
    const page = Number(searchParams.get("page")) || 1;
    const pageSize = Number(searchParams.get("pageSize")) || 10;

    const courses: CourseWithTimeRanges[] = await prisma.course.findMany({
      where: typeId ? { type: { has: typeId } } : undefined,
      include: {
        CourseTimeRanges: {
          select: {
            id: true,
            starttime: true, // 修正為 camelCase
            endtime: true, // 修正為 camelCase
            timeRange: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });

    // 設定快取頭
    const response = NextResponse.json(courses);
    response.headers.set("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=7200");
    return response;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "無法獲取課程列表",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}