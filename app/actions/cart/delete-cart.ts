'use server';

import { prisma } from '@/lib/prisma';
import { auth, UserRole } from '@/auth'; // 使用 NextAuth v5 的 auth 方法

interface DeleteCartResult {
  success: boolean;
  error?: string;
}

export async function deleteCart(userId: string): Promise<DeleteCartResult> {
  try {
    // 使用 NextAuth v5 的 auth() 方法获取 session
    const session = await auth();
    
    if (!session?.user?.id) {
      return { success: false, error: '未授權：請先登入' };
    }

    // 驗證 userId
    if (!userId) {
      return { success: false, error: '缺少用戶 ID' };
    }

    // 確保只有本人或 ADMIN 可以刪除購物車
    if (session.user.role !== UserRole.ADMIN && userId !== session.user.id) {
      return { success: false, error: '無權操作：用戶 ID 不匹配' };
    }

    // 驗證 userId 格式（UUID）
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return { success: false, error: '無效的用戶 ID 格式' };
    }

    // 刪除用戶的購物車及其關聯的 CartItem
    await prisma.cart.deleteMany({
      where: {
        userId: userId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('刪除購物車失敗:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '無法刪除購物車',
    };
  }
}