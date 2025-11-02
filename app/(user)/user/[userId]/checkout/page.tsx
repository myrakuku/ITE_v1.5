"use client";

import { useEffect, useState, useTransition } from 'react';
import { useParams } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { addStudentToAllCourses } from '@/app/actions/cart/add-student-to-course';
import { getCart } from '@/app/actions/cart/shop-cart';

// 介面定義保持不變
interface CheckoutSessionErrorResponse {
  error: string;
  details?: string;
  code?: string;
}

interface PayMeErrorResponse {
  error: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  real_price: number;
  CourseProductTypeArray: string[];
  CourseProductStatusArray: string[];
  createdAt: Date;
  updatedAt: Date;
  IsPublic: boolean;
  courseId: string | null;
}

interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: Product;
}

interface CartWithItems {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  items: CartItem[];
}

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined');
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartWithItems | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'payme'>('stripe');
  const params = useParams();
  const userId = params.userId as string;
  const { data: session, status } = useSession();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchCart() {
      try {
        const cartData = await getCart();
        if (!cartData || !cartData.items) {
          throw new Error('購物車數據無效');
        }
        setCart(cartData);
      } catch (_err) {
        setError('載入購物車失敗');
        toast.error('載入購物車失敗');
        console.error('Fetch cart error:', _err);
      }
    }
    fetchCart();
  }, []);

  const handleSubmit = async () => {
    if (!cart || status !== 'authenticated') {
      setError('請先登入');
      toast.error('請先登入');
      return;
    }

    if (userId !== session?.user?.id) {
      setError('無權操作：用戶 ID 不匹配');
      toast.error('無權操作：用戶 ID 不匹配');
      return;
    }

    // 驗證 userId 格式（UUID）
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      setError('無效的用戶 ID 格式');
      toast.error('無效的用戶 ID 格式');
      return;
    }

    // 驗證 items
    const items = cart.items
      .map((item) => ({
        name: item.product.title,
        real_price: item.product.real_price,
        quantity: item.quantity,
        productId: item.productId,
      }))
      .filter((item, index) => {
        if (!item.name || typeof item.name !== 'string') {
          setError(`無效的商品名稱: ${item.name || '未定義'} (項目 ${index + 1})`);
          toast.error(`無效的商品名稱: ${item.name || '未定義'} (項目 ${index + 1})`);
          return false;
        }
        if (typeof item.real_price !== 'number' || item.real_price <= 0) {
          setError(`無效的商品價格: ${item.real_price} (項目 ${index + 1})`);
          toast.error(`無效的商品價格: ${item.real_price} (項目 ${index + 1})`);
          return false;
        }
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
          setError(`無效的商品數量: ${item.quantity} (項目 ${index + 1})`);
          toast.error(`無效的商品數量: ${item.quantity} (項目 ${index + 1})`);
          return false;
        }
        if (!item.productId) {
          setError(`無效的商品 ID: (項目 ${index + 1})`);
          toast.error(`無效的商品 ID: (項目 ${index + 1})`);
          return false;
        }
        return true;
      });

    if (items.length === 0) {
      setError('購物車中沒有有效的商品');
      toast.error('購物車中沒有有效的商品');
      return;
    }

    startTransition(async () => {
      setError(null);
      try {
        // 傳遞 userId 給 addStudentToCourse
        console.log('Calling addStudentToCourse:', { cartId: cart.id, userId });
        const addStudentResult = await addStudentToAllCourses({ cartId: cart.id, userId });
        if (!addStudentResult.success) {
          setError(addStudentResult.error || '無法將用戶添加到課程');
          toast.error(addStudentResult.error || '無法將用戶添加到課程');
          return;
        }

        const total = items.reduce((sum, item) => sum + item.quantity * item.real_price, 0);
        const description = `訂單總計: HKD ${total.toFixed(2)} - ${items.map(item => `${item.name} (x${item.quantity})`).join(', ')}`;

        if (paymentMethod === 'stripe') {
          console.log('Sending to /api/CheckoutSessions:', { items, userId });
          const response = await axios.post('/api/CheckoutSessions', { items, userId });
          const sessionId = response.data.id;

          const stripe = await stripePromise;
          if (!stripe) {
            setError('無法初始化 Stripe');
            toast.error('無法初始化 Stripe');
            return;
          }

          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) {
            setError(error.message ?? '重定向到 Stripe 失敗');
            toast.error(error.message ?? '重定向到 Stripe 失敗');
          }
        } else if (paymentMethod === 'payme') {
          console.log('Sending to /api/payme/create:', { userId, amount: total, description, items });
          try {
            const response = await axios.post('/api/payme/create', { userId, amount: total, description, items });
            const { paymentUrl, orderId } = response.data;

            if (!paymentUrl) {
              setError('PayMe 支付連結生成失敗');
              toast.error('PayMe 支付連結生成失敗');
              return;
            }

            console.log('PayMe Response:', { paymentUrl, orderId });
            window.location.href = paymentUrl;
          } catch (error: unknown) {
            console.error('PayMe API 錯誤:', error);
            let errorMessage = 'PayMe 支付初始化失敗';
            if (error instanceof AxiosError && error.response) {
              const responseData = error.response.data as PayMeErrorResponse;
              errorMessage = responseData.error || error.message || errorMessage;
            } else if (error instanceof Error) {
              errorMessage = error.message || errorMessage;
            }
            setError(errorMessage);
            toast.error(errorMessage);
          }
        }
      } catch (error: unknown) {
        console.error('結帳錯誤:', error);
        let errorMessage = '結帳處理失敗';
        if (error instanceof AxiosError && error.response) {
          if (paymentMethod === 'stripe') {
            const responseData = error.response.data as CheckoutSessionErrorResponse;
            errorMessage = responseData.details || error.message || errorMessage;
          } else {
            const responseData = error.response.data as PayMeErrorResponse;
            errorMessage = responseData.error || error.message || errorMessage;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message || errorMessage;
        }
        setError(errorMessage);
        toast.error(errorMessage);
      }
    });
  };

  if (status === 'loading' || !cart) return <div>{error ?? '載入中...'}</div>;
  if (status === 'unauthenticated') return <div>請先登入</div>;

  const total = cart.items.reduce(
    (sum, item) => sum + item.quantity * item.product.real_price,
    0
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">結帳</h1>
      <p>
        當前用戶: {session?.user.name} (角色: {session?.user.role})
      </p>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>
              {item.product.title} (x{item.quantity})
            </span>
            <span>${(item.quantity * item.product.real_price).toFixed(2)}</span>
          </div>
        ))}
        <div className="font-bold mt-2">總計: ${total.toFixed(2)}</div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">選擇支付方式</label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              value="stripe"
              checked={paymentMethod === 'stripe'}
              onChange={(e) => setPaymentMethod(e.target.value as 'stripe' | 'payme')}
              className="mr-2"
            />
            Stripe (信用卡支付)
          </label>
          {/* <label className="flex items-center">
            <input
              type="radio"
              value="payme"
              checked={paymentMethod === 'payme'}
              onChange={(e) => setPaymentMethod(e.target.value as 'stripe' | 'payme')}
              className="mr-2"
            />
            PayMe (香港本地支付)
          </label> */}
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-300">
        <p>
          1. 所有課程費用一經繳付，概不退還。報名前請仔細閱讀課程詳情，如有查詢請通過WhatsApp（51001888）聯絡本中心。
        </p>
        <p>2. 請假不設調堂安排，但本中心將提供當日課程講義予學員。</p>
        <p>3. 惡劣天氣安排：如遇八號或以上熱帶氣旋警告信號或黑色暴雨警告生效，當日課程將自動取消，補課安排將另行通知。</p>
        <p>4. 爭議處理：所有爭議事項最終解釋權歸本教育中心所有，並受香港特別行政區法律管轄。</p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending || cart.items.length === 0}
        className={`bg-green-500 text-white px-4 py-2 rounded ${
          isPending || cart.items.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isPending ? '處理中...' : '提交訂單'}
      </button>
    </div>
  );
}
// "use client";

// import { useEffect, useState, useTransition } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import { loadStripe } from '@stripe/stripe-js';
// import { getCart } from '../../../../actions/cart/shop-cart';
// import { addStudentToCourse } from '../../../../actions/cart/add-student-to-course';
// import axios, { AxiosError } from 'axios';
// import { toast } from 'react-toastify';

// // 介面定義保持不變
// interface CheckoutSessionErrorResponse {
//   error: string;
//   details?: string;
//   code?: string;
// }

// interface PayMeErrorResponse {
//   error: string;
// }

// interface Product {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   real_price: number;
//   CourseProductTypeArray: string[];
//   CourseProductStatusArray: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   IsPublic: boolean;
//   courseId: string | null;
// }

// interface CartItem {
//   id: string;
//   cartId: string;
//   productId: string;
//   quantity: number;
//   createdAt: Date;
//   updatedAt: Date;
//   product: Product;
// }

// interface CartWithItems {
//   id: string;
//   userId: string;
//   createdAt: Date;
//   updatedAt: Date;
//   items: CartItem[];
// }

// if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
//   throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined');
// }
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// export default function CheckoutPage() {
//   const [cart, setCart] = useState<CartWithItems | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'payme'>('stripe');
//   const params = useParams();
//   const router = useRouter();
//   const userId = params.userId as string;
//   const { data: session, status } = useSession();
//   const [isPending, startTransition] = useTransition();

//   useEffect(() => {
//     async function fetchCart() {
//       try {
//         const cartData = await getCart();
//         if (!cartData || !cartData.items) {
//           throw new Error('購物車數據無效');
//         }
//         setCart(cartData);
//       } catch (err) {
//         setError('載入購物車失敗');
//         toast.error('載入購物車失敗');
//         console.error('Fetch cart error:', err);
//       }
//     }
//     fetchCart();
//   }, []);

//   const handleSubmit = async () => {
//     if (!cart || status !== 'authenticated') {
//       setError('請先登入');
//       toast.error('請先登入');
//       return;
//     }

//     if (userId !== session?.user?.id) {
//       setError('無權操作：用戶 ID 不匹配');
//       toast.error('無權操作：用戶 ID 不匹配');
//       return;
//     }

//     // 驗證 userId 格式（UUID）
//     const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
//     if (!uuidRegex.test(userId)) {
//       setError('無效的用戶 ID 格式');
//       toast.error('無效的用戶 ID 格式');
//       return;
//     }

//     // 驗證 items
//     const items = cart.items
//       .map((item, index) => ({
//         name: item.product.title,
//         real_price: item.product.real_price,
//         quantity: item.quantity,
//         productId: item.productId,
//       }))
//       .filter((item, index) => {
//         if (!item.name || typeof item.name !== 'string') {
//           setError(`無效的商品名稱: ${item.name || '未定義'} (項目 ${index})`);
//           toast.error(`無效的商品名稱: ${item.name || '未定義'} (項目 ${index})`);
//           return false;
//         }
//         if (typeof item.real_price !== 'number' || item.real_price <= 0) {
//           setError(`無效的商品價格: ${item.real_price} (項目 ${index})`);
//           toast.error(`無效的商品價格: ${item.real_price} (項目 ${index})`);
//           return false;
//         }
//         if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
//           setError(`無效的商品數量: ${item.quantity} (項目 ${index})`);
//           toast.error(`無效的商品數量: ${item.quantity} (項目 ${index})`);
//           return false;
//         }
//         if (!item.productId) {
//           setError(`無效的商品 ID: (項目 ${index})`);
//           toast.error(`無效的商品 ID: (項目 ${index})`);
//           return false;
//         }
//         return true;
//       });

//     if (items.length === 0) {
//       setError('購物車中沒有有效的商品');
//       toast.error('購物車中沒有有效的商品');
//       return;
//     }

//     startTransition(async () => {
//       setError(null);
//       try {
//         // 傳遞 userId 給 addStudentToCourse
//         console.log('Calling addStudentToCourse:', { cartId: cart.id, userId });
//         const addStudentResult = await addStudentToCourse({ cartId: cart.id, userId });
//         if (!addStudentResult.success) {
//           setError(addStudentResult.error || '無法將用戶添加到課程');
//           toast.error(addStudentResult.error || '無法將用戶添加到課程');
//           return;
//         }

//         const total = items.reduce((sum, item) => sum + item.quantity * item.real_price, 0);
//         const description = `訂單總計: HKD ${total.toFixed(2)} - ${items.map(item => `${item.name} (x${item.quantity})`).join(', ')}`;

//         if (paymentMethod === 'stripe') {
//           console.log('Sending to /api/CheckoutSessions:', { items, userId });
//           const response = await axios.post('/api/CheckoutSessions', { items, userId });
//           const sessionId = response.data.id;

//           const stripe = await stripePromise;
//           if (!stripe) {
//             setError('無法初始化 Stripe');
//             toast.error('無法初始化 Stripe');
//             return;
//           }

//           const { error } = await stripe.redirectToCheckout({ sessionId });
//           if (error) {
//             setError(error.message ?? '重定向到 Stripe 失敗');
//             toast.error(error.message ?? '重定向到 Stripe 失敗');
//           }
//         } else if (paymentMethod === 'payme') {
//           console.log('Sending to /api/payme/create:', { userId, amount: total, description, items });
//           try {
//             const response = await axios.post('/api/payme/create', { userId, amount: total, description, items });
//             const { paymentUrl, orderId } = response.data;

//             if (!paymentUrl) {
//               setError('PayMe 支付連結生成失敗');
//               toast.error('PayMe 支付連結生成失敗');
//               return;
//             }

//             console.log('PayMe Response:', { paymentUrl, orderId });
//             window.location.href = paymentUrl;
//           } catch (error: unknown) {
//             console.error('PayMe API 錯誤:', error);
//             let errorMessage = 'PayMe 支付初始化失敗';
//             if (error instanceof AxiosError && error.response) {
//               const responseData = error.response.data as PayMeErrorResponse;
//               errorMessage = responseData.error || error.message || errorMessage;
//             } else if (error instanceof Error) {
//               errorMessage = error.message || errorMessage;
//             }
//             setError(errorMessage);
//             toast.error(errorMessage);
//           }
//         }
//       } catch (error: unknown) {
//         console.error('結帳錯誤:', error);
//         let errorMessage = '結帳處理失敗';
//         if (error instanceof AxiosError && error.response) {
//           if (paymentMethod === 'stripe') {
//             const responseData = error.response.data as CheckoutSessionErrorResponse;
//             errorMessage = responseData.details || error.message || errorMessage;
//           } else {
//             const responseData = error.response.data as PayMeErrorResponse;
//             errorMessage = responseData.error || error.message || errorMessage;
//           }
//         } else if (error instanceof Error) {
//           errorMessage = error.message || errorMessage;
//         }
//         setError(errorMessage);
//         toast.error(errorMessage);
//       }
//     });
//   };

//   if (status === 'loading' || !cart) return <div>{error ?? '載入中...'}</div>;
//   if (status === 'unauthenticated') return <div>請先登入</div>;

//   const total = cart.items.reduce(
//     (sum, item) => sum + item.quantity * item.product.real_price,
//     0
//   );

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">結帳</h1>
//       <p>
//         當前用戶: {session?.user.name} (角色: {session?.user.role})
//       </p>
//       {error && <div className="text-red-500 mb-4">{error}</div>}
//       <div className="mb-4">
//         {cart.items.map((item) => (
//           <div key={item.id} className="flex justify-between mb-2">
//             <span>
//               {item.product.title} (x{item.quantity})
//             </span>
//             <span>${(item.quantity * item.product.real_price).toFixed(2)}</span>
//           </div>
//         ))}
//         <div className="font-bold mt-2">總計: ${total.toFixed(2)}</div>
//       </div>

//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2">選擇支付方式</label>
//         <div className="space-y-2">
//           <label className="flex items-center">
//             <input
//               type="radio"
//               value="stripe"
//               checked={paymentMethod === 'stripe'}
//               onChange={(e) => setPaymentMethod(e.target.value as 'stripe' | 'payme')}
//               className="mr-2"
//             />
//             Stripe (信用卡支付)
//           </label>
//           {/* <label className="flex items-center">
//             <input
//               type="radio"
//               value="payme"
//               checked={paymentMethod === 'payme'}
//               onChange={(e) => setPaymentMethod(e.target.value as 'stripe' | 'payme')}
//               className="mr-2"
//             />
//             PayMe (香港本地支付)
//           </label> */}
//         </div>
//       </div>

//       <div className="mb-4 text-sm text-gray-300">
//         <p>
//           1. 所有課程費用一經繳付，概不退還。報名前請仔細閱讀課程詳情，如有查詢請通過WhatsApp（51001888）聯絡本中心。
//         </p>
//         <p>2. 請假不設調堂安排，但本中心將提供當日課程講義予學員。</p>
//         <p>3. 惡劣天氣安排：如遇八號或以上熱帶氣旋警告信號或黑色暴雨警告生效，當日課程將自動取消，補課安排將另行通知。</p>
//         <p>4. 爭議處理：所有爭議事項最終解釋權歸本教育中心所有，並受香港特別行政區法律管轄。</p>
//       </div>

//       <button
//         onClick={handleSubmit}
//         disabled={isPending || cart.items.length === 0}
//         className={`bg-green-500 text-white px-4 py-2 rounded ${
//           isPending || cart.items.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
//         }`}
//       >
//         {isPending ? '處理中...' : '提交訂單'}
//       </button>
//     </div>
//   );
// }