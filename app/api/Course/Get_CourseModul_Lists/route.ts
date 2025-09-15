// import { db } from "@/lib/db";
// import { NextResponse } from "next/server"; 

// export async function GET(req: Request) {
//     if(req.method === 'GET'){
//         const res = await db.courseModul.findMany()
//         return NextResponse.json(res)
//     }
// }


// /api/Course/Get_CourseModul_Lists/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const courseModuls = await db.courseModul.findMany({
      include: {
        Courses: true,
        Teacher: true,
      },

    });
    return NextResponse.json(courseModuls);
  } catch (error) {
    console.error("Get_CourseModul_Lists error:", error);
    return NextResponse.json(
      { error: "無法獲取課程模組列表" },
      { status: 500 }
    );
  }
}