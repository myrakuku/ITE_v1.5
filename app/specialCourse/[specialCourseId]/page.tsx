"use client";

import { useEffect, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import YouTube from 'react-youtube';
import { addSpcialCourseToCart } from '@/app/actions/cart/add-spcialCourse-cart';
import { format } from 'date-fns';
import { zhHK } from 'date-fns/locale';
import { Play } from 'lucide-react';
import Link from 'next/link'; // 確保已 import

// === 介面定義 ===
interface ProductImg {
  id: string;
  img_url: string;
}

interface ProductVideo {
  id: string;
  video_url: string;
}

interface SpecialCourseTimeRange {
  id: string;
  timeRange: "morning" | "afternoon" | "evening" | "full_day";
  starttime: string | null;
  endtime: string | null;
}

interface SpecialCourseData {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  numberOfDays: number;
  numberOfStudents: number;
  timeHours: number;
  price: number | null;
  real_price: number | null;
  Target_Audience?: string | null;
  Course_Objective?: string | null;
  Applicable_Scenarios?: string | null;
  startDate: string | null;
  endDate: string | null;
  Coursedates: string[];
  weekday: string | null;
  classroom: string | null;
  teacher: string[];
  teacherId: string;
  createdAt: string;
  updatedAt: string;

  IMG_URL?: any;
  Video_URL?: any;
  SpecialCourseTimeRanges?: SpecialCourseTimeRange[];
}

// === 工具函數 ===
const getYouTubeId = (url: string): string | null => {
  const regex =
    /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

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

const isValidImageUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false;
  return /^https?:\/\/.+\.(jpe?g|png|gif|webp|svg)$/i.test(url);
};

const SpecialCourseById = () => {
  const params = useParams();
  const router = useRouter();
  const specialCourseId = params.specialCourseId as string;
  const [specialCourseData, setSpecialCourseData] = useState<SpecialCourseData | null>(null);
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchSpecialCourseData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/SpecialCourse/Get_SpecialCourse_by_ID/${specialCourseId}`, {
          cache: 'no-store',
        });
        if (!response.ok) throw new Error(`請求失敗: ${response.status}`);
        const data = await response.json();
        setSpecialCourseData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "無法獲取特殊課程數據");
        toast.error(err instanceof Error ? err.message : "無法獲取特殊課程數據");
      } finally {
        setIsLoading(false);
      }
    };

    if (specialCourseId) fetchSpecialCourseData();
  }, [specialCourseId]);

  const handleAddToCart = () => {
    const displayPrice = specialCourseData?.real_price ?? specialCourseData?.price;
    if (displayPrice == null) {
      toast.error("此課程未設置價格，無法加入購物車");
      return;
    }

    if (status === 'unauthenticated') {
      toast.error('請先登入以加入購物車');
      router.push('/login');
      return;
    }

    startTransition(async () => {
      try {
        await addSpcialCourseToCart(specialCourseId, 1);
        toast.success("課程已加入購物車");
        const userId = session?.user?.id;
        if (userId) router.push(`/user/${userId}/cart`);
      } catch (error) {
        console.error('加入購物車失敗:', error);
        toast.error(error instanceof Error ? `加入購物車失敗：${error.message}` : '無法加入購物車');
      }
    });
  };

  const opts = {
    height: '315',
    width: '100%',
    playerVars: { autoplay: 0, rel: 0, modestbranding: 1 },
  };

// === 安全處理：圖片、影片（支援 3 種格式）===
const rawImages = specialCourseData?.IMG_URL;
const rawVideos = specialCourseData?.Video_URL;

let images: ProductImg[] = [];

// 圖片：支援 { images: [...] }、{ url }、string
if (rawImages && typeof rawImages === 'object' && 'images' in rawImages && Array.isArray(rawImages.images)) {
  images = rawImages.images.filter((img: unknown): img is ProductImg =>
    typeof img === 'object' && img !== null && 'img_url' in img && typeof (img as any).img_url === 'string'
  );
} else if (rawImages && typeof rawImages === 'object' && 'url' in rawImages && typeof rawImages.url === 'string') {
  images = [{ id: '1', img_url: rawImages.url }];
} else if (typeof rawImages === 'string') {
  const trimmed = rawImages.trim();
  if (trimmed !== '') images = [{ id: '1', img_url: trimmed }];
}

// 影片：支援純陣列、{ videos: [...] }、string
let videos: ProductVideo[] = [];

if (Array.isArray(rawVideos)) {
  videos = rawVideos.filter((vid: unknown): vid is ProductVideo =>
    typeof vid === 'object' && vid !== null && 'video_url' in vid && typeof (vid as any).video_url === 'string'
  );
} else if (rawVideos && typeof rawVideos === 'object' && 'videos' in rawVideos && Array.isArray(rawVideos.videos)) {
  videos = rawVideos.videos.filter((vid: unknown): vid is ProductVideo =>
    typeof vid === 'object' && vid !== null && 'video_url' in vid && typeof (vid as any).video_url === 'string'
  );
} else if (typeof rawVideos === 'string') {
  const trimmed = rawVideos.trim();
  if (trimmed !== '') videos = [{ id: '1', video_url: trimmed }];
}

  const firstValidImage = images.find(img =>
    typeof img.img_url === 'string' && isValidImageUrl(img.img_url)
  ) || null;

  const firstVideo = videos[0];
  const firstVideoId = firstVideo && typeof firstVideo.video_url === 'string'
    ? getYouTubeId(firstVideo.video_url)
    : null;

  if (isLoading) return <div className="text-center py-10">載入中...</div>;

  if (error || !specialCourseData) {
    return (
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="bg-red-50 text-red-600 p-4 rounded mb-6">
          {error || "未找到課程數據"}
        </div>
      </div>
    );
  }

  console.log("specialCourseData : ", specialCourseData , " -- End -- ")

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">特殊課程詳情</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左側 */}
        <div className="space-y-6">
          <div>
            {firstValidImage ? (
              <Image
                src={firstValidImage.img_url}
                alt={specialCourseData.title}
                width={600}
                height={450}
                className="w-full h-auto rounded-lg shadow-md object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => toast.error('無法載入課程圖片')}
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96 flex items-center justify-center">
                <span className="text-gray-500">無圖片</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-1">目標群眾</h4>
              <p className="text-gray-700 whitespace-pre-line">
                {specialCourseData.Target_Audience || '未提供'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-1">課程目標</h4>
              <p className="text-gray-700 whitespace-pre-line">
                {specialCourseData.Course_Objective || '未提供'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-1">適用場景</h4>
              <p className="text-gray-700 whitespace-pre-line">
                {specialCourseData.Applicable_Scenarios || '未提供'}
              </p>
            </div>
          </div>
        </div>

        {/* 右側 */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-2">{specialCourseData.title}</h2>
            <p className="text-gray-600 mb-4">{specialCourseData.description}</p>

            {(() => {
              const displayPrice = specialCourseData.real_price ?? specialCourseData.price;
              const formattedPrice = displayPrice != null ? `HK$${displayPrice.toFixed(2)}` : '價格未設置';
              return (
                <p className="text-2xl font-bold text-blue-600">
                  {formattedPrice}
                </p>
              );
            })()}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <p><span className="font-semibold">課程代碼：</span> {specialCourseData.courseCode}</p>
            <p><span className="font-semibold">學校：</span> {specialCourseData.schoolName}</p>
            <p><span className="font-semibold">天數：</span> {specialCourseData.numberOfDays}</p>

            <p><span className="font-semibold">總時數：</span> {specialCourseData.timeHours} 小時</p>
            <p><span className="font-semibold">開始日期：</span> {formatDateWithDay(specialCourseData.startDate)}</p>
            <p><span className="font-semibold">結束日期：</span> {formatDateWithDay(specialCourseData.endDate)}</p>
            <p><span className="font-semibold">上課日期：</span>
              {specialCourseData.Coursedates.length > 0
                ? specialCourseData.Coursedates.map(formatDateWithDay).join(', ')
                : '無具體日期'}
            </p>
            <p><span className="font-semibold">課室：</span> {specialCourseData.classroom || '未設置'}</p>
            <p><span className="font-semibold">星期：</span> {specialCourseData.weekday || '未設置'}</p>
            <p><span className="font-semibold">教師：</span> {specialCourseData.teacher.join(', ') || '無'}</p>

            {(specialCourseData.SpecialCourseTimeRanges ?? []).length > 0 ? (
              specialCourseData.SpecialCourseTimeRanges!.map((t) => (
                <p key={t.id}>
                  <span className="font-semibold">時間：</span>
                  {formatTime(t.starttime)} - {formatTime(t.endtime)}
                </p>
              ))
            ) : (
              <p><span className="font-semibold">時間範圍：</span>未設置</p>
            )}
          </div>

          {videos.length > 0 && firstVideoId && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Play className="w-5 h-5" /> 課程影片
              </h3>
              <div className="relative bg-black rounded-lg overflow-hidden">
                <YouTube
                  videoId={firstVideoId}
                  opts={opts}
                  className="aspect-video"
                  iframeClassName="w-full h-full"
                />
              </div>
            </div>
          )}

            <div className="flex items-center gap-3 pt-4 border-t">
              {session ? (
                <button
                  onClick={handleAddToCart}
                  disabled={isPending || (specialCourseData.real_price ?? specialCourseData.price) == null}
                  className={`flex-1 py-3 rounded font-medium transition ${
                    isPending || (specialCourseData.real_price ?? specialCourseData.price) == null
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isPending ? '加入中...' : '加入課程'}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex-1 py-3 rounded font-medium text-center bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  登入以加入課程
                </Link>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialCourseById;