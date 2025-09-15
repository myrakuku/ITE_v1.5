// // 這是用orderId更新訂單

// import { NextRequest, NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { orderId, status } = body; // 假設 PayMe 回調返回 orderId

//     // 使用 orderId 更新訂單
//     const order = await prisma.order.update({
//       where: { id: orderId }, // 使用 id 作為唯一條件
//       data: {
//         status: status === 'success' ? 'paid' : 'failed',
//         updatedAt: new Date(),
//       },
//     });

//     console.log(`Order ${order.id} updated to ${status}`);
//     return NextResponse.json({ acknowledged: true });
//   } catch (error) {
//     console.error('Callback update failed:', error);
//     return NextResponse.json({ error: 'Update failed' }, { status: 500 });
//   }
// }



import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, status } = body;

    // 查找訂單
    const order = await prisma.order.findFirst({
      where: { paymentId }, // 使用非唯一欄位查詢
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 更新訂單
    const updatedOrder = await prisma.order.update({
      where: { id: order.id }, // 使用 id 作為唯一條件
      data: {
        status: status === 'success' ? 'paid' : 'failed',
        updatedAt: new Date(),
      },
    });

    console.log(`Order ${updatedOrder.id} updated to ${status}`);
    return NextResponse.json({ acknowledged: true });
  } catch (error) {
    console.error('Callback update failed:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}