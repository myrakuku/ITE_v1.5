import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  if (req.method === 'GET') {
    try {

            const res = await db.product.findMany();



      return NextResponse.json(res);
    } catch (error) {
      console.error('獲取商品數據失敗:', error);
      return NextResponse.json(
        { error: '無法獲取商品數據' },
        { status: 500 }
      );
    }
  }
  return NextResponse.json({ error: '方法不允許' }, { status: 405 });
}