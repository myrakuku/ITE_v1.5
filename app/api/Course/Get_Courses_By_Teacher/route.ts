// /app/api/Course/Get_Courses_By_Teacher/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get("teacherId");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (!teacherId || !year || !month) {
    return NextResponse.json({ error: "缺少必要參數" }, { status: 400 });
  }

  try {
    const courses = await prisma.course.findMany({
      where: {
        teacherId,
      },
      select: {
        id: true,
        title: true,
        Coursedates: true,
        timeHours: true,
        CourseTimeRanges: {
          select: {
            id: true,
            starttime: true,
            endtime: true,
          },
        },
      },
    });

    // 過濾 Coursedates，保留符合指定年份和月份的課程
    const filteredCourses = courses
      .map((course) => ({
        ...course,
        Coursedates: course.Coursedates.filter((date) =>
          date.startsWith(`${year}-${month}`)
        ),
      }))
      .filter((course) => course.Coursedates.length > 0);

    return NextResponse.json(filteredCourses);
  } catch {
    return NextResponse.json({ error: "無法獲取課程數據" }, { status: 500 });
  }
}