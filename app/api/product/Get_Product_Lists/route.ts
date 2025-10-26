// import { db } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//     if(req.method === 'GET'){
//         const res = await db.product.findMany()
//         return NextResponse.json(res)
//     }
// }


import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  if (req.method === 'GET') {
    try {
      // const res = await db.product.findMany({
      //   select: {
      //     id: true,
      //     title: true,
      //     description: true,
      //     price: true,
      //     real_price: true,
      //     IsPublic: true,
      //     CourseProductType: {
      //       select:{
      //         typename: true
      //       }
      //     },
      //     CourseProductStatus: {
      //       select:{
      //         statuename: true
      //       }
      //     },
      //     Course:true,
      //   },
      // });

            const res = await db.product.findMany({
              include: {
                CourseProductType: true,
                CourseProductStatus: true,
                Course: {
                  include: {
                    CourseTimeRanges: true,
                  },
                },
                Product_Img: true,
              },
            });

      // 將關聯數據轉換為 CoursePorductTypeArray 和 CoursePorductStatueArray
      // const validatedData = res.map((product) => ({
      //   ...product,
      //   CoursePorductTypeArray: product.CourseProductType.map((type) => type.id),
      //   CoursePorductStatueArray: product.CourseProductStatus.map((status) => status.id),
      // }));

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