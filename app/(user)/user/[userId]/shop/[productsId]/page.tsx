// 'use client'

// import { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { addToCart } from '@/app/actions/cart/shop-cart';

// interface ProductDetail {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   createdAt?: string;
//   updatedAt?: string;
// }



// export default function ProductPage() {
//   const param_id = useParams();
//   const productId = param_id.productsId as string;
//   const userId = param_id.userId as string;
//   const [quantity, setQuantity] = useState(1);
//   const router = useRouter();
//   const [getProduct, setGetProduct] = useState<ProductDetail | null>(null);

//   useEffect(() => {
//     const fetchProductDataLists = async (productId: string) => {
//       try {
//         const response = await fetch(`/api/product/Get_Product_Lists_by_ID/${productId}`);
//         if (!response.ok) {
//           throw new Error('無法獲取商品數據');
//         }
//         const data = await response.json();
//         setGetProduct(data);
//       } catch (error) {
//         console.error('獲取商品數據失敗:', error);
//       }
//     };

//     fetchProductDataLists(productId);
//   }, [productId]);

//   const handleAddToCart = async () => {
//     if (getProduct) {
//       await addToCart(productId, quantity, getProduct); // 傳遞三個參數
//       router.push(`/user/${userId}/cart`);
//     }
//   };

//   if (!getProduct) {
//     return <div>載入中...</div>;
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">商品詳情</h1>
//       <div className="mb-4">
//         <h2 className="text-xl font-semibold">{getProduct.title}</h2>
//         <p className="text-gray-600">{getProduct.description}</p>
//         <p className="text-lg font-bold">價格: ${getProduct.price}</p>
//       </div>
//       <input
//         type="number"
//         value={quantity}
//         onChange={(e) => setQuantity(Number(e.target.value))}
//         min="1"
//         className="border p-2 mr-2"
//       />
//       <button
//         onClick={handleAddToCart}
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         加入購物車
//       </button>
//     </div>
//   );
// }


'use client';

import { useEffect, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { addToCart } from '@/app/actions/cart/shop-cart';
import { format } from 'date-fns';

interface CourseTimeRange {
  id: string;
  starttime: string | null;
  endtime: string | null;
}

interface ProductDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  real_price: number;
  createdAt?: string;
  updatedAt?: string;
  Course?: {
    startDate?: string | null;
    endDate?: string | null;
    Coursedates: string[];
    timeHours: number;
    CourseTimeRanges?: CourseTimeRange[];
  };
}

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return '未設置';
  try {
    return format(new Date(dateStr), 'yyyy-MM-dd');
  } catch {
    return '無效日期';
  }
};

const formatTime = (time: string | null | undefined): string => {
  if (time == null) return "未設置";
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  if (!timeRegex.test(time)) return "無效時間";
  return time;
};

export default function ProductPage() {
  const param_id = useParams();
  const productId = param_id.productsId as string;
  const userId = param_id.userId as string;
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const [getProduct, setGetProduct] = useState<ProductDetail | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDataLists = async (productId: string) => {
      try {
        const response = await fetch(`/api/product/Get_Product_Lists_by_ID/${productId}`);
        if (!response.ok) {
          throw new Error('無法獲取商品數據');
        }
        const data = await response.json();
        setGetProduct(data);
      } catch (error) {
        console.error('獲取商品數據失敗:', error);
        setError('無法載入商品詳情');
      }
    };

    fetchProductDataLists(productId);
  }, [productId]);

  const handleAddToCart = async () => {
    startTransition(async () => {
      try {
        await addToCart(productId, quantity);
        router.push(`/user/${userId}/cart`);
      } catch (error) {
        console.error('加入購物車失敗:', error);
        setError(
          error instanceof Error ? `加入購物車失敗：${error.message}` : '無法加入購物車'
        );
      }
    });
  };

  if (!getProduct) {
    return <div>{error ?? '載入中...'}</div>;
  }

  console.log("getProduct :", getProduct);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">商品詳情</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{getProduct.title}</h2>
        <p className="text-gray-600">{getProduct.description}</p>
        <p className="text-lg font-bold">價格: ${(getProduct.real_price).toFixed(2)}</p>
        {getProduct.Course && (
          <div className="mt-4">
            <p className="text-gray-700">
              <span className="font-semibold">課程開始日期：</span>
              {formatDate(getProduct.Course.startDate)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">課程結束日期：</span>
              {formatDate(getProduct.Course.endDate)}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">課程日期：</span>
              {getProduct.Course.Coursedates.length > 0
                ? getProduct.Course.Coursedates.map(formatDate).join(', ')
                : '無具體日期'}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">課程總時數：</span>
              {getProduct.Course.Coursedates.length && getProduct.Course.timeHours
                ? (getProduct.Course.Coursedates.length * getProduct.Course.timeHours).toFixed(1)
                : '未設置'} 小時
            </p>
            {getProduct.Course.CourseTimeRanges && getProduct.Course.CourseTimeRanges.length > 0 ? (
              getProduct.Course.CourseTimeRanges.map((timeRange) => (
                <p key={timeRange.id} className="text-gray-700">
                  <span className="font-semibold">時間：</span>
                  {formatTime(timeRange.starttime)} - {formatTime(timeRange.endtime)}
                </p>
              ))
            ) : (
              <p className="text-gray-700">
                <span className="font-semibold">時間：</span>未設置
              </p>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          className="border p-2 w-20"
          disabled={isPending}
        />
        <button
          onClick={handleAddToCart}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${
            isPending ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isPending}
        >
          {isPending ? '加入中...' : '加入購物車'}
        </button>
      </div>
    </div>
  );
}