// app/api/SpecialCourse/SpecialCourse_Lists/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const courses = await db.specialCourse.findMany({
      include: {
        Students: true,
        SpecialCourseTimeRanges: {
          select: { id: true, timeRange: true, starttime: true, endtime: true },
        },
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("載入特殊課程失敗:", error);
    return NextResponse.json({ error: "載入失敗" }, { status: 500 });
  }
}