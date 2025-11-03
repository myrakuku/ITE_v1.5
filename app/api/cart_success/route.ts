// app/api/cart_success/route.ts
import { getCart } from '@/app/actions/cart/shop-cart';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: '未授權' }, { status: 401 });
  }

  const cart = await getCart();
  if (!cart) {
    return NextResponse.json({ error: '購物車不存在' }, { status: 404 });
  }

  return NextResponse.json({ id: cart.id });
}