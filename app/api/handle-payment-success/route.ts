
'use server';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

import { createId } from '@paralleldrive/cuid2'; // 引入 cuid2

// 檢查環境變量
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil',
});

// 定義輸入型別
interface PaymentSuccessInput {
  sessionId: string;
  userId: string;
  username: string;
}

// 定義回應型別
interface SuccessResponse {
  success: true;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    const body = await req.json();
    const { sessionId, userId, username } = body as PaymentSuccessInput;

    // 驗證輸入
    if (!sessionId || !userId || !username) {
      return NextResponse.json({ error: '缺少必要的參數' }, { status: 400 });
    }

    // 檢查權限
    const session = await auth();
    if (!session?.user?.id || session.user.id !== userId) {
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    // 查詢 Stripe 結帳會話
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.json({ error: '支付尚未完成' }, { status: 400 });
    }

    // 從用戶的 Cart 中獲取 CartItem 的 productId
    const cart = await prisma.cart.findFirst({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                description: true,
                price: true,
                courseId: true,
              },
            },
          },
        },
      },
    });

    // 如果購物車為空，視為已處理（idempotency），直接返回成功
    if (!cart || !cart.items.length) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // 提取 productIds
    const productIds = cart.items.map((item) => item.productId);

    // 查找對應的產品和課程（雖然我們已經在 cart include 中拿到了 product 資料，但為了完整性保留）
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

    // 將用戶添加到 GroupMember 表（如果需要，取消註釋）
    // await prisma.groupMember.createMany({
    //   data: courseIds.map((courseId) => ({
    //     username,
    //     courseId,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   })),
    //   skipDuplicates: true,
    // });

    // 新增：將 Cart 中的每個 CartItem 轉化為 Accounts 記錄
    // 假設每個 CartItem 對應一個 Accounts 記錄（基於產品）
    // 注意：Accounts model 中的 'cilent_name' 可能是拼寫錯誤，應為 'client_name'，但根據 schema 保持原樣
    // 'price' 使用產品的 price，'total' 計算為 price * quantity
    // 'date' 使用字符串格式的當前日期 (e.g., ISO string)
    // 'title' 和 'description' 直接從產品拿取
    const currentDate = new Date().toISOString();
await prisma.accounts.createMany({
  data: cart.items.map((item) => ({
    client_name: username,
    title: item.product.title,
    description: item.product.description, // ← 確認 accounts 是否有此欄位
    price: item.product.price,
    total: item.product.price * item.quantity,
    date: currentDate,
    client_id: userId,
  })),
  skipDuplicates: true,
});

// app/api/handle-payment-success/route.ts


await prisma.invoice.createMany({
  data: cart.items.map((item) => ({
    studentname: username,
    title: item.product.title,
    description: item.product.description,
    price: item.product.price,
    total: item.product.price * item.quantity,
    date: currentDate, // 現在對應 schema 的 DateTime
    student_id: userId,
    Invoice_id: createId(),
    servetype: "",
    DB: 0,
    adminFee: 0,
    content: [],
    PaymentMethods: [],
  })),
  skipDuplicates: true,
});


    // 清空用戶的購物車（刪除 Cart 和相關的 CartItem）
    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId,
        },
      },
    });

    // 可選：如果需要完全刪除 Cart 記錄
    await prisma.cart.deleteMany({
      where: {
        userId,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('處理支付成功失敗:', {
      message: error instanceof Error ? error.message : '未知錯誤',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      {
        error: '無法處理支付成功',
        details: error instanceof Error ? error.message : '未知錯誤',
      },
      { status: 500 },
    );
  }
}