'use client';

import { useEffect, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { zhHK } from 'date-fns/locale'; // 引入中文（香港）語言環境
import Image from 'next/image';

interface CourseTimeRange {
  id: string;
  starttime: string | null;
  endtime: string | null;
}

interface ProductImg {
  id: string;
  img_url: string;
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
  Product_Img: ProductImg[];
}

// 格式化日期並添加星期
const formatDateWithDay = (dateStr?: string | null) => {
  if (!dateStr) return '未設置';
  try {
    const date = new Date(dateStr);
    return `${format(date, 'yyyy-MM-dd', { locale: zhHK })} (${format(date, 'EEEE', { locale: zhHK })})`;
  } catch {
    return '無效日期';
  }
};

const formatTime = (time: string | null | undefined): string => {
  if (time == null) return '未設置';
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  if (!timeRegex.test(time)) return '無效時間';
  return time;
};

export default function ShopPagebyId() {
  const param_id = useParams();
  const productId = param_id.shopId as string;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [quantity, setQuantity] = useState(1);
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

  const handleAddToCart = () => {
    if (status === 'unauthenticated') {
      alert('請先登入以加入購物車');
      router.push('/login');
      return;
    }

    startTransition(async () => {
      try {
        const userId = session?.user?.id;
        if (!userId) {
          setError('無法獲取用戶 ID');
          return;
        }
        // await addToCart(productId, quantity);
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

  console.log('getProduct:', getProduct, '-- End --');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">商品詳情</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 圖片顯示 */}
        <div>
          {getProduct.Product_Img && getProduct.Product_Img.length > 0 ? (
            <Image
              src={getProduct.Product_Img[0].img_url}
              alt={getProduct.title}
              width={400}
              height={300}
              className="w-full h-64 object-cover rounded-md"
              priority={true}
              placeholder="blur"
              blurDataURL="/placeholder-image.jpg"
            />
          ) : (
            <Image
              src="/placeholder-image.jpg"
              alt="無圖片"
              width={400}
              height={300}
              className="w-full h-64 object-cover rounded-md"
              priority={true}
              placeholder="blur"
              blurDataURL="/placeholder-image.jpg"
            />
          )}
        </div>
        {/* 商品詳情 */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{getProduct.title}</h2>
          <p className="text-gray-600">{getProduct.description}</p>
          <p className="text-lg font-bold">價格: HK${getProduct.real_price.toFixed(2)}</p>
          {getProduct.Course && (
            <div className="mt-4">
              <p className="text-gray-700">
                <span className="font-semibold">課程開始日期：</span>
                {formatDateWithDay(getProduct.Course.startDate)}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">課程結束日期：</span>
                {formatDateWithDay(getProduct.Course.endDate)}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">課程日期：</span>
                {getProduct.Course.Coursedates.length > 0
                  ? getProduct.Course.Coursedates.map(formatDateWithDay).join(', ')
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
          <div className="flex items-center gap-2 mt-4">
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
      </div>
    </div>
  );
}