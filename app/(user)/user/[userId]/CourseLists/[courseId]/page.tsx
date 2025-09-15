// "use client";

// import { useParams} from "next/navigation";
// import { useEffect, useState } from "react";
// import Link from "next/link";

// interface CourseData {
//   id: string;
//   title: string;
//   description: string;
//   courseCode: string;
//   schoolName: string;
//   Students: string[];
//   teacher: string[];
//   teacherId: string;
//   createdAt: string;
//   updatedAt: string;
//   CourseTypes: string[] | null;
//   Coursedates: string[];
//   Producted: boolean;
//   courseModulId: string;
//   endDate: string | null;
//   isProduct: boolean;
//   isPublic: boolean;
//   numberOfDays: number;
//   startDate: string | null;
//   timeHours: number;
//   timeRange: string[];
//   type: string[];
//   weekday: string | null;
//   classroom: string | null;
// }

// const CourseDataById = () => {
//   const params = useParams();
//   const userId = params.userId as string;
//   const courseId = params.courseId as string;
//   const [courseData, setCourseData] = useState<CourseData | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchCourseDataById = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(`/api/Course/Get_Course_Lists_by_Id/${courseId}`);
//         if (!response.ok) {
//           throw new Error(`請求失敗: ${response.status}`);
//         }
//         const data = await response.json();
//         setCourseData(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("無法獲取課程數據");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (courseId) {
//       fetchCourseDataById();
//     }
//   }, [courseId]);

//   console.log("courseData:", courseData, "-- End --");

//   if (isLoading) {
//     return (
//       <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
//         <div className="flex items-center">
//           <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
//           </svg>
//           載入中...
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-gray-900 min-h-screen text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <div className="text-red-500">{error}</div>
//         </div>
//       </div>
//     );
//   }

//   if (!courseData) {
//     return (
//       <div className="bg-gray-900 min-h-screen text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//           <p className="text-gray-400">無課程數據</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-900 min-h-screen text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* 標題與返回按鈕 */}
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">課程詳情</h1>
//           <Link
//             href={`/user/${userId}/CourseLists`}
//             className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-medium hover:bg-gray-600 transition"
//           >
//             返回課程列表
//           </Link>
//         </div>

//         {/* 課程數據展示 */}
//         <div className="bg-gray-800 shadow-lg rounded-lg p-6">
//           <h2 className="text-xl font-semibold mb-4">{courseData.title}</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-400">課程代碼</p>
//               <p className="text-base">{courseData.courseCode}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-400">學校</p>
//               <p className="text-base">{courseData.schoolName}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-400">描述</p>
//               <p className="text-base">{courseData.description || "無描述"}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-400">教師</p>
//               <p className="text-base">{courseData.teacher.join(", ") || "無教師"}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-400">課程類型</p>
//               <p className="text-base">{courseData.CourseTypes?.join(", ") || "無類型"}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-400">課程日期</p>
//               <p className="text-base">{courseData.Coursedates.join(", ") || "無日期"}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-400">開始日期</p>
//               <p className="text-base">{courseData.startDate || "未設置"}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-400">結束日期</p>
//               <p className="text-base">{courseData.endDate || "未設置"}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-400">課程天數</p>
//               <p className="text-base">{courseData.numberOfDays}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-400">課程時數</p>
//               <p className="text-base">{courseData.timeHours}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-400">時間範圍</p>
//               <p className="text-base">{courseData.timeRange.join(", ") || "無時間範圍"}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-400">教室</p>
//               <p className="text-base">{courseData.classroom || "未設置"}</p>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CourseDataById;


"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface CourseTimeRange {
  id: string;
  courseId: string;
  starttime: string;
  endtime: string;
  timeRange: string;
  createdAt: string;
  updatedAt: string;
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  Students: string[];
  teacher: string[];
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  CourseTypes: string[] | null;
  Coursedates: string[];
  Producted: boolean;
  courseModulId: string;
  endDate: string | null;
  isProduct: boolean;
  isPublic: boolean;
  numberOfDays: number;
  startDate: string | null;
  timeHours: number;
  timeRange: string[];
  type: string[];
  weekday: string | null;
  classroom: string | null;
  CourseTimeRanges: CourseTimeRange[];
}

const CourseDataById = () => {
  const params = useParams();
  const userId = params.userId as string;
  const courseId = params.courseId as string;
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDataById = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/Course/Get_Course_Lists_by_Id/${courseId}`);
        if (!response.ok) {
          throw new Error(`請求失敗: ${response.status}`);
        }
        const data = await response.json();
        setCourseData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("無法獲取課程數據");
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDataById();
    }
  }, [courseId]);

  console.log("courseData:", courseData, "-- End --");

  if (isLoading) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <div className="flex items-center">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
          </svg>
          載入中...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="bg-gray-900 min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-gray-400">無課程數據</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">課程詳情</h1>
          <Link
            href={`/user/${userId}/CourseLists`}
            className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-medium hover:bg-gray-600 transition"
          >
            返回課程列表
          </Link>
        </div>
        <div className="bg-gray-800 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">{courseData.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">課程代碼</p>
              <p className="text-base">{courseData.courseCode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">學校</p>
              <p className="text-base">{courseData.schoolName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">描述</p>
              <p className="text-base">{courseData.description || "無描述"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">教師</p>
              <p className="text-base">{courseData.teacher.join(", ") || "無教師"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">課程類型</p>
              <p className="text-base">{courseData.CourseTypes?.join(", ") || "無類型"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">課程日期</p>
              <p className="text-base">{courseData.Coursedates.join(", ") || "無日期"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">開始日期</p>
              <p className="text-base">{courseData.startDate || "未設置"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">結束日期</p>
              <p className="text-base">{courseData.endDate || "未設置"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">課程天數</p>
              <p className="text-base">{courseData.numberOfDays}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">課程時數</p>
              <p className="text-base">{courseData.timeHours}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">時間範圍</p>
              <p className="text-base">
                {courseData.CourseTimeRanges.length > 0
                  ? courseData.CourseTimeRanges.map(range => 
                      range.starttime && range.endtime 
                        ? `${range.starttime} - ${range.endtime}` 
                        : "無時間範圍"
                    ).join(", ")
                  : "無時間範圍"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">教室</p>
              <p className="text-base">{courseData.classroom || "未設置"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDataById;