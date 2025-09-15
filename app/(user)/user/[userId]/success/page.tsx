// 'use client';

// import { useEffect, useState } from 'react';
// import { useParams, useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import { useSession } from 'next-auth/react';
// import axios, { AxiosError } from 'axios';
// import { deleteCart } from '@/app/actions/cart/delete-cart';

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
//   const [ GetCartItems , setGetCartItems ] = useState([]);


//   useEffect(()=>{
    
//       const fetchCartData = async () => {
//         try {
//           const response = await fetch(`/api/Cart/Get_Cart_Items_by_UserId/${userId}`);
          
//           const data = await response.json();
          
//           setGetCartItems(data);
//         } catch (error) {
//           console.error('獲取購物車數據失敗:', error);
//         }
//       };
//       fetchCartData()
//   },[])

  
//   console.log("CartItems:", GetCartItems ,"-- End  --"  ) 


//   useEffect(() => {
//     async function handlePaymentSuccess() {
//       if (status !== 'authenticated' || !session?.user) {
//         setError('請先登入');
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
//       console.log('sessionId:', sessionId);
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

//         // 使用 Server Action 刪除購物車
//         const deleteCartResult = await deleteCart(userId);
//         if (!deleteCartResult.success) {
//           setError(deleteCartResult.error || '無法刪除購物車');
//           setLoading(false);
//           return;
//         }

//         setLoading(false);
//       } catch (err: unknown) {
//         console.error('處理支付或刪除購物車失敗:', err);
//         let errorMessage = '無法處理支付或刪除購物車，請聯繫支持';

//         if (err instanceof AxiosError && err.response) {
//           // AxiosError
//           const responseData = err.response.data as PaymentSuccessErrorResponse;
//           errorMessage = responseData.error || err.message || errorMessage;
//         } else if (err instanceof Error) {
//           // 其他 Error（包括 deleteCart 拋出的錯誤）
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



'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';

// 定義 /api/handle-payment-success 的錯誤響應結構
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

  useEffect(() => {
    async function handlePaymentSuccess() {
      if (status !== 'authenticated' || !session?.user) {
        // setError('請先登入');
        setLoading(false);
        return;
      }

      // 驗證 userId 是否與 session.user.id 匹配
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
        // 調用後端 API 處理支付成功
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
  }, [status, session, userId, searchParams]);

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
        </div>
      )}
      <Link href={`/user/${userId}/CourseLists`} className="text-blue-500 underline">
        查看您的課程
      </Link>
    </div>
  );
}