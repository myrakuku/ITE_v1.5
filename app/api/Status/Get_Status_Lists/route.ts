// import { db } from "@/lib/db";
// import { NextResponse } from "next/server"; 

// export async function GET(req: Request) {
//     if(req.method === 'GET'){
//         const res = await db.coursePorductStatue.findMany()
//         return NextResponse.json(res)
//     }
// }


// /api/Status/Get_Status_Lists
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  if (req.method === 'GET') {
    try {
      const res = await db.courseProductStatus.findMany();
      return NextResponse.json(res);
    } catch (error) {
      console.error('獲取狀態數據失敗:', error);
      return NextResponse.json(
        { error: '無法獲取狀態數據' },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ error: '方法不允許' }, { status: 405 });
}