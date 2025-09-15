'use server';

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Accounts } from '@prisma/client'; // 假設 Accounts 是 Prisma 模型

export async function GET() {
  console.log("in server GET")
  try {
    const accounts: Accounts[] = await db.accounts.findMany();
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '無法獲取帳戶列表',
      },
      { status: 500 }
    );
  }
}