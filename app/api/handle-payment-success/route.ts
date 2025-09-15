// import { NextRequest, NextResponse } from 'next/server';
// import Stripe from 'stripe';
// import { prisma } from '@/lib/prisma'; // 假設你有一個 prisma 實例

// // 檢查環境變量
// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error('STRIPE_SECRET_KEY is not defined');
// }

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: '2023-10-16',
// });

// export async function POST(req: NextRequest) {
//   try {
//     const { sessionId, userId, username } = await req.json();

//     // 驗證輸入
//     if (!sessionId || !userId || !username) {
//       return NextResponse.json({ error: '缺少必要的參數' }, { status: 400 });
//     }

//     // 查詢 Stripe 結帳會話
//     const session = await stripe.checkout.sessions.retrieve(sessionId);
//     if (session.payment_status !== 'paid') {
//       return NextResponse.json({ error: '支付尚未完成' }, { status: 400 });
//     }

//     // 從結帳會話中獲取 metadata（如果需要，可以在創建結帳會話時添加 metadata）
//     // 假設你在結帳會話中存儲了 productIds 或其他信息
//     const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
//     const productIds = lineItems.data.map((item) => item.price?.product);

//     // 查找對應的產品和課程
//     const products = await prisma.product.findMany({
//       where: {
//         id: { in: productIds as string[] },
//       },
//       select: {
//         id: true,
//         courseId: true,
//       },
//     });

//     const courseIds = products
//       .filter((product) => product.courseId)
//       .map((product) => product.courseId) as string[];

//     if (courseIds.length === 0) {
//       return NextResponse.json({ error: '未找到相關課程' }, { status: 400 });
//     }

//     // 將用戶添加到 GroupMember 表
//     await prisma.groupMember.createMany({
//       data: courseIds.map((courseId) => ({
//         username,
//         courseId,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })),
//       skipDuplicates: true, // 避免重複添加
//     });

//     // 清空用戶的購物車（可選）
//     await prisma.cartItem.deleteMany({
//       where: {
//         cart: {
//           userId,
//         },
//       },
//     });

//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (error) {
//     console.error('處理支付成功失敗:', error);
//     return NextResponse.json(
//       { error: '無法處理支付成功', details: (error as any).message },
//       { status: 500 }
//     );
//   }
// }



// // app/api/handle-payment-success/route.ts
// 'use server';

// import { NextRequest, NextResponse } from 'next/server';
// import Stripe from 'stripe';
// import { prisma } from '@/lib/prisma';
// import { auth } from '@/auth';

// // 檢查環境變量
// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error('STRIPE_SECRET_KEY is not defined');
// }

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: '2025-07-30.basil', // 更新為正確的 API 版本
// });

// // 定義輸入型別
// interface PaymentSuccessInput {
//   sessionId: string;
//   userId: string;
//   username: string;
// }

// // 定義回應型別
// interface SuccessResponse {
//   success: true;
// }

// interface ErrorResponse {
//   error: string;
//   details?: string;
// }

// export async function POST(
//   req: NextRequest,
// ): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
//   try {
//     const body = await req.json();
//     const { sessionId, userId, username } = body as PaymentSuccessInput;

//     // 驗證輸入
//     if (!sessionId || !userId || !username) {
//       return NextResponse.json({ error: '缺少必要的參數' }, { status: 400 });
//     }

//     // 檢查權限
//     const session = await auth();
//     if (!session?.user?.id || session.user.id !== userId) {
//       return NextResponse.json({ error: '未授權' }, { status: 401 });
//     }

//     // 查詢 Stripe 結帳會話
//     const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
//     if (checkoutSession.payment_status !== 'paid') {
//       return NextResponse.json({ error: '支付尚未完成' }, { status: 400 });
//     }

//     // 獲取產品 ID
//     const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
//     const productIds = lineItems.data
//       .map((item) => item.price?.product)
//       .filter((id): id is string => typeof id === 'string');

//     if (!productIds.length) {
//       return NextResponse.json({ error: '未找到產品' }, { status: 400 });
//     }


//     console.log("productIds : ", productIds)
//     console.log("lineItems : ", lineItems)

//     // 查找對應的產品和課程
//     const products = await prisma.product.findMany({
//       where: {
//         id: { in: productIds },
//       },
//       select: {
//         id: true,
//         courseId: true,
//       },
//     });

//     const courseIds = products
//       .filter((product) => product.courseId)
//       .map((product) => product.courseId) as string[];

//     if (courseIds.length === 0) {
//       return NextResponse.json({ error: '未找到相關課程' }, { status: 400 });
//     }

//     // 將用戶添加到 GroupMember 表
//     await prisma.groupMember.createMany({
//       data: courseIds.map((courseId) => ({
//         username,
//         courseId,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })),
//       skipDuplicates: true,
//     });

//     // 清空用戶的購物車
//     await prisma.cartItem.deleteMany({
//       where: {
//         cart: {
//           userId,
//         },
//       },
//     });

//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (error) {
//     console.error('處理支付成功失敗:', {
//       message: error instanceof Error ? error.message : '未知錯誤',
//       stack: error instanceof Error ? error.stack : undefined,
//     });
//     return NextResponse.json(
//       {
//         error: '無法處理支付成功',
//         details: error instanceof Error ? error.message : '未知錯誤',
//       },
//       { status: 500 },
//     );
//   }
// }



// 'use server';

// import { NextRequest, NextResponse } from 'next/server';
// import Stripe from 'stripe';
// import { prisma } from '@/lib/prisma';
// import { auth } from '@/auth';

// // 檢查環境變量
// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error('STRIPE_SECRET_KEY is not defined');
// }

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: '2025-07-30.basil',
// });

// // 定義輸入型別
// interface PaymentSuccessInput {
//   sessionId: string;
//   userId: string;
//   username: string;
// }

// // 定義回應型別
// interface SuccessResponse {
//   success: true;
// }

// interface ErrorResponse {
//   error: string;
//   details?: string;
// }

// export async function POST(
//   req: NextRequest,
// ): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
//   try {
//     const body = await req.json();
//     const { sessionId, userId, username } = body as PaymentSuccessInput;

//     // 驗證輸入
//     if (!sessionId || !userId || !username) {
//       return NextResponse.json({ error: '缺少必要的參數' }, { status: 400 });
//     }

//     // 檢查權限
//     const session = await auth();
//     if (!session?.user?.id || session.user.id !== userId) {
//       return NextResponse.json({ error: '未授權' }, { status: 401 });
//     }

//     // 查詢 Stripe 結帳會話
//     const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
//     if (checkoutSession.payment_status !== 'paid') {
//       return NextResponse.json({ error: '支付尚未完成' }, { status: 400 });
//     }

//     // 從用戶的 Cart 中獲取 CartItem 的 productId
//     const cart = await prisma.cart.findFirst({
//       where: {
//         userId,
//       },
//       include: {
//         items: {
//           select: {
//             productId: true,
//           },
//         },
//       },
//     });

//     if (!cart || !cart.items.length) {
//       return NextResponse.json({ error: '購物車為空' }, { status: 400 });
//     }

//     // 提取 productIds
//     const productIds = cart.items.map((item) => item.productId);

//     // 查找對應的產品和課程
//     const products = await prisma.product.findMany({
//       where: {
//         id: { in: productIds },
//       },
//       select: {
//         id: true,
//         courseId: true,
//       },
//     });

//     const courseIds = products
//       .filter((product) => product.courseId)
//       .map((product) => product.courseId) as string[];

//     if (courseIds.length === 0) {
//       return NextResponse.json({ error: '未找到相關課程' }, { status: 400 });
//     }

//     // 將用戶添加到 GroupMember 表
//     // await prisma.groupMember.createMany({
//     //   data: courseIds.map((courseId) => ({
//     //     username,
//     //     courseId,
//     //     createdAt: new Date(),
//     //     updatedAt: new Date(),
//     //   })),
//     //   skipDuplicates: true,
//     // });

//     // 清空用戶的購物車（刪除 Cart 和相關的 CartItem）
//     await prisma.cartItem.deleteMany({
//       where: {
//         cart: {
//           userId,
//         },
//       },
//     });

//     // 可選：如果需要完全刪除 Cart 記錄
//     await prisma.cart.deleteMany({
//       where: {
//         userId,
//       },
//     });

//     return NextResponse.json({ success: true }, { status: 200 });
//   } catch (error) {
//     console.error('處理支付成功失敗:', {
//       message: error instanceof Error ? error.message : '未知錯誤',
//       stack: error instanceof Error ? error.stack : undefined,
//     });
//     return NextResponse.json(
//       {
//         error: '無法處理支付成功',
//         details: error instanceof Error ? error.message : '未知錯誤',
//       },
//       { status: 500 },
//     );
//   }
// }





'use server';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

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
        client_name: username, // 使用 username 作為 cilent_name
        title: item.product.title, // 從產品拿 title
        description: item.product.description, // 從產品拿 description
        price: item.product.price, // 單價
        total: item.product.price * item.quantity, // 總價 = 單價 * 數量
        date: currentDate, // 當前日期作為字符串
        client_id: userId, // 用戶 ID
      })),
      skipDuplicates: true, // 可選：避免重複，如果有 unique 約束
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