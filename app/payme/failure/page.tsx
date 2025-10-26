"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function PayMeFailure() {
  const router = useRouter();

  useEffect(() => {
    toast.error('支付失敗，請重試。');
    router.push('/checkout');
  }, [router]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">支付失敗</h1>
      <p>支付過程出現錯誤，請返回結帳頁面重試。</p>
    </div>
  );
}