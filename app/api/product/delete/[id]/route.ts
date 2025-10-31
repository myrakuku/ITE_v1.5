// // app/api/product/delete/[id]/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function DELETE(request: NextRequest) {
//   // 從 URL 取得 id（Next.js 會自動把 [id] 放進 searchParams）
//   const id = request.nextUrl.pathname.split('/').pop();

//   if (!id) {
//     return NextResponse.json({ error: '缺少產品 ID' }, { status: 400 });
//   }

//   try {
//     const product = await prisma.product.findUnique({
//       where: { id },
//       include: {
//         Course: { select: { Students: true } },
//       },
//     });

//     if (!product) {
//       return NextResponse.json({ error: '產品不存在' }, { status: 404 });
//     }

//     const studentCount = product.Course?.Students.length ?? 0;
//     if (studentCount > 0) {
//       return NextResponse.json(
//         { error: `此產品有 ${studentCount} 名學生報名，無法刪除` },
//         { status: 400 }
//       );
//     }

//     await prisma.product.delete({ where: { id } });

//     return NextResponse.json({ message: '產品已永久刪除' }, { status: 200 });
//   } catch (error) {
//     console.error('Delete product error:', error);
//     return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }



// app/api/product/delete/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
  // 從 URL 取得 id（Next.js 13+ 會自動解析 [id]）
  const id = request.nextUrl.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ error: '缺少產品 ID' }, { status: 400 });
  }

  try {
    // 1. 檢查產品是否存在 + 是否有學生報名
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        Course: { select: { Students: true } },
        Product_Course_Dates: true,
        Product_Img: true,
        Product_video: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: '產品不存在' }, { status: 404 });
    }

    const studentCount = product.Course?.Students.length ?? 0;
    if (studentCount > 0) {
      return NextResponse.json(
        { error: `此產品有 ${studentCount} 名學生報名，無法刪除` },
        { status: 400 }
      );
    }

    // 2. 開始交易：先刪除所有關聯資料
    await prisma.$transaction(async (tx) => {
      // 刪除 Product_Course_Dates
      if (product.Product_Course_Dates.length > 0) {
        await tx.product_Course_Dates.deleteMany({
          where: { ProductId: id },
        });
      }

      // 刪除 Product_Img
      if (product.Product_Img.length > 0) {
        await tx.product_Img.deleteMany({
          where: { ProductId: id },
        });
      }

      // 刪除 Product_video
      if (product.Product_video.length > 0) {
        await tx.product_video.deleteMany({
          where: { ProductId: id },
        });
      }

      // 最後刪除 Product 本身
      await tx.product.delete({
        where: { id },
      });
    });

    return NextResponse.json(
      { message: '產品及所有相關資料已永久刪除' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: '刪除失敗，請稍後再試' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}