// app/api/cart/route.ts
import { getCart } from '@/app/actions/cart/shop-cart';
import { auth } from '@/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return Response.json({ error: '未授權' }, { status: 401 });

  const cart = await getCart();
  if (!cart) return Response.json({ error: '購物車不存在' }, { status: 404 });

  return Response.json({ id: cart.id });
}