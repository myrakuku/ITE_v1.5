

// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import { useSession } from 'next-auth/react';
// import axios, { AxiosError } from 'axios';

// // 定義 /api/handle-payment-success 的錯誤響應結構
// interface PaymentSuccessErrorResponse {
//   error: string;
//   details?: string;
// }

// export default function SuccessPage() {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const userId = params.userId as string;
//   const { data: session, status } = useSession();
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function handlePaymentSuccess() {
//       if (status !== 'authenticated' || !session?.user) {
//         // setError('請先登入');
//         setLoading(false);
//         return;
//       }

//       // 驗證 userId 是否與 session.user.id 匹配
//       if (userId !== session.user.id) {
//         setError('無權操作：用戶 ID 不匹配');
//         setLoading(false);
//         return;
//       }

//       const sessionId = searchParams.get('session_id');
//       if (!sessionId) {
//         setError('無效的支付會話');
//         setLoading(false);
//         return;
//       }

//       try {
//         // 調用後端 API 處理支付成功
//         const paymentResponse = await axios.post('/api/handle-payment-success', {
//           sessionId,
//           userId,
//           username: session.user.name || '匿名用戶',
//         });

//         if (paymentResponse.data.error) {
//           setError(paymentResponse.data.error);
//           setLoading(false);
//           return;
//         }

//         setLoading(false);
//       } catch (err: unknown) {
//         console.error('處理支付失敗:', err);
//         let errorMessage = '無法處理支付，請聯繫支持';

//         if (err instanceof AxiosError && err.response) {
//           const responseData = err.response.data as PaymentSuccessErrorResponse;
//           errorMessage = responseData.error || err.message || errorMessage;
//         } else if (err instanceof Error) {
//           errorMessage = err.message || errorMessage;
//         }

//         setError(errorMessage);
//         setLoading(false);
//       }
//     }

//     handlePaymentSuccess();
//   }, [status, session, userId, searchParams]);

//   if (status === 'loading' || loading) {
//     return <div>載入中...</div>;
//   }

//   if (status === 'unauthenticated') {
//     return <div>請先登入</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">支付成功</h1>
//       {error ? (
//         <div className="text-red-500 mb-4">{error}</div>
//       ) : (
//         <div className="mb-4">
//           <p>感謝您的購買！您已成功註冊課程，購物車已清空。</p>
//         </div>
//       )}
//       <Link href={`/user/${userId}/CourseLists`} className="text-blue-500 underline">
//         查看您的課程
//       </Link>
//     </div>
//   );
// }


// app/(user)/user/[userId]/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { addStudentToAllCourses } from '@/app/actions/cart/add-student-to-course';

// 定義錯誤響應結構
interface PaymentSuccessErrorResponse {
  error: string;
  details?: string;
}

export default function SuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = params.userId as string;
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [addStudentDone, setAddStudentDone] = useState(false);

useEffect(() => {
  async function handlePaymentSuccess() {
    if (status !== 'authenticated' || !session?.user) {
      setLoading(false);
      return;
    }

    if (userId !== session.user.id) {
      setError('無權操作：用戶 ID 不匹配');
      setLoading(false);
      return;
    }

    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setError('無效的支付會話');
      setLoading(false);
      return;
    }

    try {
      // === 1. 調用後端驗證支付成功 ===
      const paymentResponse = await axios.post('/api/handle-payment-success', {
        sessionId,
        userId,
        username: session.user.name || '匿名用戶',
      });

      if (paymentResponse.data.error) {
        setError(paymentResponse.data.error);
        setLoading(false);
        return;
      }

      // === 2. 支付成功後：將用戶加入所有已購課程 ===
      if (!addStudentDone) {
        try {
          const cartResponse = await axios.get('/api/cart_success');
          const cartId = cartResponse.data.id;

          const addResult = await addStudentToAllCourses({ cartId, userId });

          if (addResult.success) {
            setAddStudentDone(true);
          } else {
            console.warn('加入課程失敗（非致命）:', addResult.error);
          }
        } catch (addErr: any) {
          if (addErr.response?.status === 404) {
            console.warn('購物車已清空，跳過加入課程');
            setAddStudentDone(true);
          } else {
            console.warn('加入課程 API 失敗:', addErr);
          }
        }
      }

      setLoading(false);
    } catch (err: unknown) {
      console.error('處理支付失敗:', err);
      let errorMessage = '無法處理支付，請聯繫支持';

      if (err instanceof AxiosError && err.response) {
        const responseData = err.response.data as PaymentSuccessErrorResponse;
        errorMessage = responseData.error || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }

      setError(errorMessage);
      setLoading(false);
    }
  }

  handlePaymentSuccess();
}, [status, session, userId, searchParams, addStudentDone]);

  if (status === 'loading' || loading) {
    return <div>載入中...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>請先登入</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">支付成功</h1>
      {error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : (
        <div className="mb-4">
          <p>感謝您的購買！您已成功註冊課程，購物車已清空。</p>
          {addStudentDone ? (
            <p className="text-green-600">已成功將您加入所有已購課程。</p>
          ) : (
            <p className="text-yellow-600">正在處理課程註冊，請稍候...</p>
          )}
        </div>
      )}
      <Link href={`/user/${userId}/CourseLists`} className="text-blue-500 underline">
        查看您的課程
      </Link>
    </div>
  );
}