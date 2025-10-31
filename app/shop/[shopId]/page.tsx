'use client';

import { useEffect, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format } from 'date-fns';
import { zhHK } from 'date-fns/locale';
import Image from 'next/image';
import YouTube from 'react-youtube';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface CourseTimeRange {
  id: string;
  starttime: string | null;
  endtime: string | null;
}

interface ProductImg {
  id: string;
  img_url: string;
}

interface ProductVideo {
  id: string;
  video_url: string;
}

interface ProductDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  real_price: number;
  createdAt?: string;
  updatedAt?: string;
  Target_Audience?: string | null;
  Course_Objective?: string | null;
  Applicable_Scenarios?: string | null;
  Course?: {
    startDate?: string | null;
    endDate?: string | null;
    Coursedates: string[];
    timeHours: number;
    CourseTimeRanges?: CourseTimeRange[];
  };
  Product_Img: ProductImg[];
  Product_video: ProductVideo[];
}

// 提取 YouTube ID
const getYouTubeId = (url: string): string | null => {
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// 格式化日期 + 星期
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
  return timeRegex.test(time) ? time : '無效時間';
};

export default function ShopPagebyId() {
  const { shopId: productId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [getProduct, setGetProduct] = useState<ProductDetail | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const fetchProductDataLists = async (id: string) => {
      try {
        const response = await fetch(`/api/product/Get_Product_Lists_by_ID/${id}`);
        if (!response.ok) throw new Error('無法獲取商品數據');
        const data = await response.json();
        setGetProduct(data);
      } catch (err) {
        console.error('獲取商品數據失敗:', err);
        setError('無法載入商品詳情');
      }
    };

    if (productId) fetchProductDataLists(productId as string);
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
        if (!userId) throw new Error('無法獲取用戶 ID');
        // await addToCart(productId, quantity);
        router.push(`/user/${userId}/cart`);
      } catch (err) {
        setError(err instanceof Error ? `加入購物車失敗：${err.message}` : '無法加入購物車');
      }
    });
  };

  const opts = {
    height: '315',
    width: '100%',
    playerVars: { autoplay: 0, rel: 0, modestbranding: 1 },
  };

  const videos = getProduct?.Product_video || [];
  const currentVideo = videos[currentVideoIndex];
  const currentVideoId = currentVideo ? getYouTubeId(currentVideo.video_url) : null;

  if (!getProduct) {
    return <div className="text-center py-10">{error ?? '載入中...'}</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">商品詳情</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左側：圖片 + 三欄資訊 */}
        <div className="space-y-6">
          {/* 主圖 */}
          <div>
            {getProduct.Product_Img.length > 0 ? (
              <Image
                src={getProduct.Product_Img[0].img_url}
                alt={getProduct.title}
                width={600}
                height={450}
                className="w-full h-auto rounded-lg shadow-md object-cover"
                priority
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center">
                <span className="text-gray-500">無圖片</span>
              </div>
            )}
          </div>

          {/* 三欄資訊卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-1">目標觀眾</h4>
              <p className="text-gray-700">{getProduct.Target_Audience || '未提供'}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-1">課程目標</h4>
              <p className="text-gray-700">{getProduct.Course_Objective || '未提供'}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-1">適用場景</h4>
              <p className="text-gray-700">{getProduct.Applicable_Scenarios || '未提供'}</p>
            </div>
          </div>
        </div>

        {/* 右側：詳情 + 課程 + 影片 + 購物車 */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">{getProduct.title}</h2>
            <p className="text-gray-600 mb-4">{getProduct.description}</p>
            <p className="text-2xl font-bold text-blue-600">HK${getProduct.real_price.toFixed(2)}</p>
          </div>

          {/* 課程資訊 */}
          {getProduct.Course && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <p><span className="font-semibold">開始日期：</span> {formatDateWithDay(getProduct.Course.startDate)}</p>
              <p><span className="font-semibold">結束日期：</span> {formatDateWithDay(getProduct.Course.endDate)}</p>
              <p><span className="font-semibold">上課日期：</span>
                {getProduct.Course.Coursedates.length > 0
                  ? getProduct.Course.Coursedates.map(formatDateWithDay).join(', ')
                  : '無具體日期'}
              </p>
              <p><span className="font-semibold">總時數：</span>
                {getProduct.Course.Coursedates.length && getProduct.Course.timeHours
                  ? `${(getProduct.Course.Coursedates.length * getProduct.Course.timeHours).toFixed(1)} 小時`
                  : '未設置'}
              </p>
              {(getProduct.Course?.CourseTimeRanges ?? []).length > 0 ? (
                getProduct.Course.CourseTimeRanges!.map((t) => (
                  <p key={t.id}>
                    <span className="font-semibold">時間：</span>
                    {formatTime(t.starttime)} - {formatTime(t.endtime)}
                  </p>
                ))
              ) : (
                <p><span className="font-semibold">時間：</span>未設置</p>
              )}
            </div>
          )}

          {/* YouTube 影片播放器 + 切換功能 */}
          {videos.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Play className="w-5 h-5" /> 課程影片
              </h3>

              <div className="relative bg-black rounded-lg overflow-hidden">
                {currentVideoId ? (
                  <YouTube
                    videoId={currentVideoId}
                    opts={opts}
                    className="aspect-video"
                    iframeClassName="w-full h-full"
                  />
                ) : (
                  <div className="bg-gray-800 text-white flex items-center justify-center h-80 rounded">
                    無法載入影片
                  </div>
                )}
              </div>

           
            </div>
          )}

          {/* 加入購物車 */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              min="1"
              className="border rounded p-2 w-20 text-center"
              disabled={isPending}
            />
            <button
              onClick={handleAddToCart}
              disabled={isPending}
              className={`flex-1 py-3 rounded font-medium transition ${
                isPending
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isPending ? '加入中...' : '加入購物車'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}