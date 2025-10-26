// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
//   try {
//     const { id } = await params; // 等待 params Promise 解析

//     const res = await db.product.findUnique({
//       where: {
//         id: String(id), // 確保 id 是字符串類型
//       }
//     });

//     if (!res) {
//       return NextResponse.json({ error: "任務記錄未找到" }, { status: 404 });
//     }

//     return NextResponse.json(res);
//   } catch (error) {
//     console.error("獲取任務記錄失敗：", error);
//     return NextResponse.json({ error: "內部服務器錯誤" }, { status: 500 });
//   }
// }

import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // 等待 params Promise 解析
    console.log(`Request URL: ${req.url}`); // 使用 req 記錄請求

    const res = await db.product.findUnique({
      where: {
        id: String(id),
      },
      include: {
        Course: {
                  include: {
                    CourseTimeRanges: true,
                    
                  },
        },
        Product_Img: true,
      },
    });

    if (!res) {
      return NextResponse.json({ error: "商品記錄未找到" }, { status: 404 });
    }

    return NextResponse.json(res);
  } catch (error) {
    console.error("獲取商品記錄失敗：", error);
    return NextResponse.json({ error: "內部服務器錯誤" }, { status: 500 });
  }
}