// "use client";

// import { useEffect, useState, useTransition } from 'react';

// import { useParams, useRouter } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import toast from 'react-hot-toast';
// import YouTube from 'react-youtube';
// import { addSpcialCourseToCart } from '@/app/actions/cart/add-spcialCourse-cart';

// // 定義 specialCourseData 的接口，與回傳數據匹配
// interface SpecialCourseData {
//   id: string;
//   title: string;
//   description: string;
//   courseCode: string;
//   schoolName: string;
//   numberOfDays: number;
//   numberOfStudents: number;
//   timeHours: number;
//   timeRange: string[];
//   startDate: string | null;
//   endDate: string | null;
//   Coursedates: string[];
//   weekday: string | null;
//   classroom: string | null;
//   teacher: string[];
//   teacherId: string;
//   isPublic: boolean;
//   isProduct: boolean;
//   Producted: boolean;
//   type: string[];
//   courseModulId: string | null;
//   createdAt: string;
//   updatedAt: string;
//   price: number | null;
//   IMG_URL: string | null;
//   Video_URL: string | null;
//   SpecialCourseTimeRanges?: {
//     id: string;
//     timeRange: "morning" | "afternoon" | "evening" | "full_day";
//     starttime: string | null;
//     endtime: string | null;
//   }[];
// }

// // 輔助函數：從 YouTube URL 提取影片 ID
// const getYouTubeVideoId = (url: string | null): string | null => {
//   if (!url) return null;
//   const regex = /[?&]v=([^&#]*)/;
//   const match = url.match(regex);
//   return match ? match[1] : null;
// };

// const SpecialCourseById = () => {
//   const params = useParams();
//   const router = useRouter();
//   const specialCourseId = params.specialCourseId as string;
//   const [specialCourseData, setSpecialCourseData] = useState<SpecialCourseData | null>(null);
//   const { data: session, status } = useSession();
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isPending, startTransition] = useTransition();

//   useEffect(() => {
//     const fetchSpecialCourseData = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(`/api/SpecialCourse/Get_SpecialCourse_by_ID/${specialCourseId}`);
//         if (!response.ok) {
//           throw new Error(`請求失敗: ${response.status}`);
//         }
//         const data = await response.json();
//         setSpecialCourseData(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "無法獲取特殊課程數據");
//         toast.error(err instanceof Error ? err.message : "無法獲取特殊課程數據");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (specialCourseId) {
//       fetchSpecialCourseData();
//     }
//   }, [specialCourseId]);

//   console.log("specialCourseData : ", specialCourseData, "-- End --");

//   const handleAddToCart = () => {
//     if (!specialCourseData?.isPublic) {
//       toast.error("此課程不公開，無法加入購物車");
//       return;
//     }

//     if (specialCourseData?.price == null) {
//       toast.error("此課程未設置價格，無法加入購物車");
//       return;
//     }

//     if (status === 'unauthenticated') {
//       toast.error('請先登入以加入購物車');
//       router.push('/login');
//       return;
//     }

//     startTransition(async () => {
//       try {
//         await addSpcialCourseToCart(specialCourseId, 1);
//         toast.success("課程已加入購物車");
//         const userId = session?.user?.id;
//         if (userId) {
//           router.push(`/user/${userId}/cart`);
//         }
//       } catch (error) {
//         console.error('加入購物車失敗:', error);
//         toast.error(
//           error instanceof Error ? `加入購物車失敗：${error.message}` : '無法加入購物車'
//         );
//       }
//     });
//   };

//   // YouTube 播放器配置
//   const youtubeOpts = {
//     height: '360',
//     width: '640',
//     playerVars: {
//       autoplay: 0,
//     },
//   };

//   return (
//     <div className="bg-gray-800 text-white min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">特殊課程詳情</h1>
//         </div>

//         {error && (
//           <div className="bg-red-600 text-white p-4 rounded-md mb-6">
//             {error}
//           </div>
//         )}

//         {isLoading ? (
//           <div className="text-center py-10">載入中...</div>
//         ) : !specialCourseData ? (
//           <div className="text-center py-10 text-gray-400">未找到課程數據</div>
//         ) : (
//           <div className="bg-gray-700 rounded-md p-6 shadow-lg">
//             <h2 className="text-lg font-semibold mb-4">{specialCourseData.title}</h2>
//             <p className="text-sm text-gray-300 mb-2">
//               <span className="font-medium">課程代碼:</span> {specialCourseData.courseCode}
//             </p>
//             <p className="text-sm text-gray-300 mb-2">
//               <span className="font-medium">描述:</span> {specialCourseData.description}
//             </p>
//             <p className="text-sm text-gray-300 mb-2">
//               <span className="font-medium">價格:</span>{" "}
//               {specialCourseData.price != null ? `$${specialCourseData.price}` : "未設置"}
//             </p>
//             <p className="text-sm text-gray-300 mb-2">
//               <span className="font-medium">學校:</span> {specialCourseData.schoolName}
//             </p>
//             <p className="text-sm text-gray-300 mb-2">
//               <span className="font-medium">天數:</span> {specialCourseData.numberOfDays}
//             </p>
//             <p className="text-sm text-gray-300 mb-2">
//               <span className="font-medium">學生數:</span> {specialCourseData.numberOfStudents}
//             </p>
//             <p className="text-sm text-gray-300 mb-2">
//               <span className="font-medium">課程時數:</span> {specialCourseData.timeHours}
//             </p>
//             <p className="text-sm text-gray-300 mb-2">
//               <span className="font-medium">開始日期:</span>{" "}
//               {specialCourseData.startDate || "未設置"}
//             </p>
//             <p className="text-sm text-gray-300 mb-2">
//               <span className="font-medium">結束日期:</span>{" "}
//               {specialCourseData.endDate || "未設置"}
//             </p>
//             <p className="text-sm text-gray-300 mb-2">
//               <span className="font-medium">教師:</span>{" "}
//               {specialCourseData.teacher.join(", ") || "無"}
//             </p>
//             <p className="text-sm text-gray-300 mb-2">
//               <span className="font-medium">課室:</span>{" "}
//               {specialCourseData.classroom || "未設置"}
//             </p>
//             <p className="text-sm text-gray-300 mb-2">
//               <span className="font-medium">星期:</span>{" "}
//               {specialCourseData.weekday || "未設置"}
//             </p>
//             <p className="text-sm text-gray-300 mb-2">
//               <span className="font-medium">課程日期:</span>{" "}
//               {specialCourseData.Coursedates.length > 0
//                 ? specialCourseData.Coursedates.join(", ")
//                 : "無"}
//             </p>

//             {/* 顯示圖片 */}
//             {specialCourseData.IMG_URL ? (
//               <div className="mt-4">
//                 <img
//                   src={specialCourseData.IMG_URL}
//                   alt={specialCourseData.title}
//                   className="max-w-full h-auto rounded-md object-cover"
//                   onError={(e) => {
//                     e.currentTarget.src = '/placeholder-image.jpg'; // 圖片載入失敗時的備用圖片
//                     toast.error('無法載入課程圖片');
//                   }}
//                 />
//               </div>
//             ) : (
//               <div className="mt-4 text-sm text-gray-400">無課程圖片</div>
//             )}

//             {/* 顯示 YouTube 影片 */}
//             {specialCourseData.Video_URL && (
//               <div className="mt-4">
//                 <h3 className="text-md font-semibold mb-2">課程影片</h3>
//                 {getYouTubeVideoId(specialCourseData.Video_URL) ? (
//                   <div className="relative w-full" style={{ paddingTop: '56.25%' /* 16:9 長寬比 */ }}>
//                     <YouTube
//                       videoId={getYouTubeVideoId(specialCourseData.Video_URL)!}
//                       opts={youtubeOpts}
//                       className="absolute top-0 left-0 w-full h-full"
//                       onError={() => toast.error('無法載入 YouTube 影片')}
//                     />
//                   </div>
//                 ) : (
//                   <div className="text-sm text-gray-400">無效的 YouTube 影片網址</div>
//                 )}
//               </div>
//             )}

//             {specialCourseData.SpecialCourseTimeRanges && specialCourseData.SpecialCourseTimeRanges.length > 0 && (
//               <div className="mt-4">
//                 <h3 className="text-md font-semibold mb-2">時間範圍</h3>
//                 {specialCourseData.SpecialCourseTimeRanges.map((tr) => (
//                   <p key={tr.id} className="text-sm text-gray-300 mb-1">
//                     <span className="font-medium">{tr.timeRange}:</span>{" "}
//                     {tr.starttime || "未設置"} - {tr.endtime || "未設置"}
//                   </p>
//                 ))}
//               </div>
//             )}

//             <div className="mt-6 flex justify-center space-x-4">
//               <button
//                 onClick={handleAddToCart}
//                 className={`px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition ${
//                   isPending || !session || specialCourseData.price == null
//                     ? 'opacity-50 cursor-not-allowed'
//                     : ''
//                 }`}
//                 disabled={isPending || !session || specialCourseData.price == null}
//               >
//                 {isPending ? '加入中...' : '加入購物車'}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SpecialCourseById;



"use client";

import { useEffect, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import YouTube from 'react-youtube';
import { addSpcialCourseToCart } from '@/app/actions/cart/add-spcialCourse-cart';
import { format } from 'date-fns';
import { zhHK } from 'date-fns/locale'; // 引入中文（香港）語言環境


// 定義 specialCourseData 的接口，與回傳數據匹配
interface SpecialCourseData {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  numberOfDays: number;
  numberOfStudents: number;
  timeHours: number;
  timeRange: string[];
  startDate: string | null;
  endDate: string | null;
  Coursedates: string[];
  weekday: string | null;
  classroom: string | null;
  teacher: string[];
  teacherId: string;
  isPublic: boolean;
  isProduct: boolean;
  Producted: boolean;
  type: string[];
  courseModulId: string | null;
  createdAt: string;
  updatedAt: string;
  price: number | null;
  IMG_URL: string | null;
  Video_URL: string | null;
  SpecialCourseTimeRanges?: {
    id: string;
    timeRange: "morning" | "afternoon" | "evening" | "full_day";
    starttime: string | null;
    endtime: string | null;
  }[];
}

// 輔助函數：從 YouTube URL 提取影片 ID
const getYouTubeVideoId = (url: string | null): string | null => {
  if (!url) return null;
  const regex = /[?&]v=([^&#]*)/;
  const match = url.match(regex);
  return match ? match[1] : null;
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
        const response = await fetch(`/api/SpecialCourse/Get_SpecialCourse_by_ID/${specialCourseId}`);
        if (!response.ok) {
          throw new Error(`請求失敗: ${response.status}`);
        }
        const data = await response.json();
        setSpecialCourseData(data);
      } catch (_err) {
        setError(_err instanceof Error ? _err.message : "無法獲取特殊課程數據");
        toast.error(_err instanceof Error ? _err.message : "無法獲取特殊課程數據");
      } finally {
        setIsLoading(false);
      }
    };

    if (specialCourseId) {
      fetchSpecialCourseData();
    }
  }, [specialCourseId]);

  console.log("specialCourseData : ", specialCourseData, "-- End --");

  const handleAddToCart = () => {
    if (!specialCourseData?.isPublic) {
      toast.error("此課程不公開，無法加入購物車");
      return;
    }

    if (specialCourseData?.price == null) {
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
        if (userId) {
          router.push(`/user/${userId}/cart`);
        }
      } catch (error) {
        console.error('加入購物車失敗:', error);
        toast.error(
          error instanceof Error ? `加入購物車失敗：${error.message}` : '無法加入購物車'
        );
      }
    });
  };

  // YouTube 播放器配置
  const youtubeOpts = {
    height: '360',
    width: '640',
    playerVars: {
      autoplay: 0,
    },
  };

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


  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">特殊課程詳情</h1>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-10">載入中...</div>
        ) : !specialCourseData ? (
          <div className="text-center py-10 text-gray-400">未找到課程數據</div>
        ) : (
          <div className="bg-gray-700 rounded-md p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">{specialCourseData.title}</h2>
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-medium">課程代碼:</span> {specialCourseData.courseCode}
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-medium">描述:</span> {specialCourseData.description}
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-medium">價格:</span>{" "}
              {specialCourseData.price != null ? `$${specialCourseData.price}` : "未設置"}
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-medium">學校:</span> {specialCourseData.schoolName}
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-medium">天數:</span> {specialCourseData.numberOfDays}
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-medium">學生數:</span> {specialCourseData.numberOfStudents}
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-medium">課程時數:</span> {specialCourseData.timeHours}
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-medium">開始日期:</span>{" "}
              {specialCourseData.startDate || "未設置"}
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-medium">結束日期:</span>{" "}
              {specialCourseData.endDate || "未設置"}
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-medium">教師:</span>{" "}
              {specialCourseData.teacher.join(", ") || "無"}
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-medium">課室:</span>{" "}
              {specialCourseData.classroom || "未設置"}
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-medium">星期:</span>{" "}
              {specialCourseData.weekday || "未設置"}
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-medium">課程日期:</span>{" "}
              {specialCourseData.Coursedates.length > 0
                ? specialCourseData.Coursedates.map(formatDateWithDay).join(", ")
                : "無"}
            </p>

            {/* 顯示圖片 */}
            {specialCourseData.IMG_URL ? (
              <div className="mt-4 relative w-full h-64">
                <Image
                  src={specialCourseData.IMG_URL}
                  alt={specialCourseData.title}
                  fill
                  className="rounded-md object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  placeholder="blur"
                  blurDataURL="/placeholder-image.jpg"
                  onError={() => toast.error('無法載入課程圖片')}
                />
              </div>
            ) : (
              <div className="mt-4 text-sm text-gray-400">無課程圖片</div>
            )}

            {/* 顯示 YouTube 影片 */}
            {specialCourseData.Video_URL && (
              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">課程影片</h3>
                {getYouTubeVideoId(specialCourseData.Video_URL) ? (
                  <div className="relative w-full" style={{ paddingTop: '56.25%' /* 16:9 長寬比 */ }}>
                    <YouTube
                      videoId={getYouTubeVideoId(specialCourseData.Video_URL)!}
                      opts={youtubeOpts}
                      className="absolute top-0 left-0 w-full h-full"
                      onError={() => toast.error('無法載入 YouTube 影片')}
                    />
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">無效的 YouTube 影片網址</div>
                )}
              </div>
            )}

            {specialCourseData.SpecialCourseTimeRanges && specialCourseData.SpecialCourseTimeRanges.length > 0 && (
              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">時間範圍</h3>
                {specialCourseData.SpecialCourseTimeRanges.map((tr) => (
                  <p key={tr.id} className="text-sm text-gray-300 mb-1">
                    <span className="font-medium">{tr.timeRange}:</span>{" "}
                    {tr.starttime || "未設置"} - {tr.endtime || "未設置"}
                  </p>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={handleAddToCart}
                className={`px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition ${
                  isPending || !session || specialCourseData.price == null
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                disabled={isPending || !session || specialCourseData.price == null}
              >
                {isPending ? '加入中...' : '加入購物車'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialCourseById;