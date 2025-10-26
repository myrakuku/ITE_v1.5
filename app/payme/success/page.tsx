// "use client";

// import { useEffect } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// export default function PayMeSuccess() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const orderId = searchParams.get('orderId');

//   useEffect(() => {
//     if (orderId) {
//       // 檢查訂單狀態
//       axios.get(`/api/orders/${orderId}`).then((response) => {
//         if (response.data.status === 'paid') {
//           toast.success('支付成功！');
//           router.push('/user/orders'); // 重新導向到訂單頁
//         } else {
//           toast.error('支付失敗，請重試。');
//           router.push('/checkout');
//         }
//       }).catch(() => {
//         toast.error('無法檢查訂單狀態');
//         router.push('/checkout');
//       });
//     }
//   }, [orderId, router]);

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">支付成功</h1>
//       <p>訂單 ID: {orderId}</p>
//       <p>正在檢查訂單狀態...</p>
//     </div>
//   );
// }

// app/payme/success/page.tsx
import { Suspense } from 'react';
import PayMeSuccessContent from './PayMeSuccessContent';

export default function PayMeSuccessPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <PayMeSuccessContent />
    </Suspense>
  );
}