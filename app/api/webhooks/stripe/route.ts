// app/api/webhooks/stripe/route.ts
'use server';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// 檢查環境變量
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}
if (!process.env.STRIPE_SECRET_WEBHOOK_KEY) {
  throw new Error('STRIPE_SECRET_WEBHOOK_KEY is not defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil', // 更新為正確的 API 版本
});

// 定義 metadata 驗證
const MetadataSchema = z.object({
  userId: z.string(),
  username: z.string(),
});

// 定義回應型別
interface SuccessResponse {
  received: true;
}

interface ErrorResponse {
  error: string;
  details?: unknown;
}

export async function POST(req: NextRequest): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    // 直接讀取原始請求體
    const rawBody = await req.arrayBuffer();
    const sig = req.headers.get('stripe-signature');

    if (!sig) {
      return NextResponse.json({ error: '缺少 Stripe 簽名' }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      sig,
      process.env.STRIPE_SECRET_WEBHOOK_KEY!,
    );

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('支付完成:', session);

        // 獲取產品 ID
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const productIds = lineItems.data
          .map((item) => item.price?.product)
          .filter((id): id is string => typeof id === 'string');

        if (!productIds.length) {
          return NextResponse.json({ error: '未找到產品' }, { status: 400 });
        }

        // 查找對應的產品和課程
        const products = await prisma.product.findMany({
          where: {
            id: { in: productIds },
          },
          select: {
            id: true,
            courseId: true,
          },
        });

        const courseIds = products
          .filter((product) => product.courseId)
          .map((product) => product.courseId) as string[];

        if (courseIds.length === 0) {
          return NextResponse.json({ error: '未找到相關課程' }, { status: 400 });
        }

        // 驗證 metadata
        const { userId, username } = MetadataSchema.parse(session.metadata);

        // 更新資料庫：將用戶添加到 GroupMember
        await prisma.$transaction([
          prisma.groupMember.createMany({
            data: courseIds.map((courseId) => ({
              username,
              courseId,
              createdAt: new Date(),
              updatedAt: new Date(),
            })),
            skipDuplicates: true,
          }),
          prisma.cartItem.deleteMany({
            where: {
              cart: {
                userId,
              },
            },
          }),
        ]);

        break;
      case 'checkout.session.async_payment_succeeded':
        console.log('非同步支付成功:', event.data.object);
        // 可添加類似處理邏輯
        break;
      case 'checkout.session.expired':
        console.log('結帳會話過期:', event.data.object);
        break;
      default:
        console.log(`未處理的事件類型: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Webhook Error:', {
      message: error instanceof Error ? error.message : '未知錯誤',
      stack: error instanceof Error ? error.stack : undefined,
      eventType: event?.type,
    });
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '無效的 metadata', details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        error: 'Webhook 處理失敗',
        details: error instanceof Error ? error.message : JSON.stringify(error),
      },
      { status: 400 },
    );
  }
}