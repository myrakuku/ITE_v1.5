// app/payme/success/PayMeSuccessContent.tsx
"use client";

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function PayMeSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      axios.get(`/api/orders/${orderId}`).then((response) => {
        if (response.data.status === 'paid') {
          toast.success('支付成功！');
          router.push('/user/orders');
        } else {
          toast.error('支付失败，请重试。');
          router.push('/checkout');
        }
      }).catch(() => {
        toast.error('无法检查订单状态');
        router.push('/checkout');
      });
    }
  }, [orderId, router]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">支付成功</h1>
      <p>订单 ID: {orderId}</p>
      <p>正在检查订单状态...</p>
    </div>
  );
}