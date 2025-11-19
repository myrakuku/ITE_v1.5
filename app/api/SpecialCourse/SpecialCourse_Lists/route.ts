// app/api/SpecialCourse/SpecialCourse_Lists/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const courses = await prisma.specialCourse.findMany({
      include: {
        Students: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        SpecialCourseTimeRanges: {
          select: { id: true, timeRange: true, starttime: true, endtime: true },
        },
      },
    });

    console.log("API SpecialCourse_Lists 回傳:", courses); // 除錯用

    return NextResponse.json(courses);
  } catch (error) {
    console.error("載入特殊課程失敗:", error);
    return NextResponse.json({ error: "載入失敗" }, { status: 500 });
  }
}