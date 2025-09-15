import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();
const PAYME_API_URL = process.env.PAYME_API_URL || 'https://api.sandbox.payme.hsbc.com.hk/v1';
const CLIENT_ID = process.env.PAYME_CLIENT_ID;
const SECRET_KEY = process.env.PAYME_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount, description, items } = body;

    // 創建訂單
    const order = await prisma.order.create({
      data: {
        userId,
        total: amount,
        status: 'PENDING',
        paymentId: null, // 初始為 null
      },
    });

    // 創建 OrderItem
    for (const item of items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        },
      });
    }

    // 調用 PayMe API，傳遞 orderId
    const paymeResponse = await axios.post(
      `${PAYME_API_URL}/payments`,
      {
        clientId: CLIENT_ID,
        amount: amount * 100, // 分為單位
        currency: 'HKD',
        description,
        orderId: order.id, // 傳遞訂單 ID
        successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payme/success`,
        failureUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payme/failure`,
      },
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${SECRET_KEY}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const paymentId = paymeResponse.data.paymentId; // 儲存 PayMe 支付 ID

    // 更新訂單以儲存 paymentId
    await prisma.order.update({
      where: { id: order.id }, // 使用 id 作為唯一條件
      data: { paymentId },
    });

    return NextResponse.json({
      paymentUrl: paymeResponse.data.paymentUrl,
      orderId: order.id,
    });
  } catch (error) {
    console.error('Payment creation failed:', error);
    return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 });
  }
}