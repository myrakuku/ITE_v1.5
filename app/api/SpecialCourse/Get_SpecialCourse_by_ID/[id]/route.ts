// app/api/SpecialCourse/Get_SpecialCourse_by_ID/[id]/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const course = await db.specialCourse.findUnique({
      where: { id: String(id) },
      include: {
        SpecialCourseTimeRanges: {
          select: { id: true, timeRange: true, starttime: true, endtime: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: "課程不存在" }, { status: 404 });
    }

// 關鍵：禁用快取，強制每次重新查詢
    const response = NextResponse.json(course);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');


    return response;
  } catch (error) {
    console.error("獲取課程失敗：", error);
    return NextResponse.json({ error: "內部錯誤" }, { status: 500 });
  }
}