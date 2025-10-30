// app/api/product/delete/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest) {
  // 從 URL 取得 id（Next.js 會自動把 [id] 放進 searchParams）
  const id = request.nextUrl.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ error: '缺少產品 ID' }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        Course: { select: { Students: true } },
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

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ message: '產品已永久刪除' }, { status: 200 });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}