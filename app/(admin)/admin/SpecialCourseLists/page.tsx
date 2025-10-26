// "use client";

// import Link from "next/link";
// import { useTransition, useEffect, useState } from "react";
// import { format } from 'date-fns';
// import { zhHK } from 'date-fns/locale'; // 引入中文（香港）語言環境



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
// }

// const SpecialCourseLists = () => {
//   const [SpecialCourseList, setSpecialCourseList] = useState<SpecialCourseData[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [isPending, startTransition] = useTransition();

//   useEffect(() => {
//     const fetchData = async () => {
//       startTransition(async () => {
//         try {
//           const response = await fetch("/api/SpecialCourse/SpecialCourse_Lists");
//           if (!response.ok) {
//             throw new Error(`請求失敗: ${response.status}`);
//           }
//           const data = await response.json();
//           setSpecialCourseList(data);
//         } catch {
//           setError("無法獲取特殊課程數據");
//         }
//       });
//     };
//     fetchData();
//   }, []);

//   // 格式化日期並添加星期
//   const formatDateWithDay = (dateStr?: string | null) => {
//     if (!dateStr) return '未設置';
//     try {
//       const date = new Date(dateStr);
//       return `${format(date, 'yyyy-MM-dd', { locale: zhHK })} (${format(date, 'EEEE', { locale: zhHK })})`;
//     } catch {
//       return '無效日期';
//     }
//   };

//   console.log("SpecialCourseList : ", SpecialCourseList, "-- End --");

//   return (
//     <div className="bg-gray-800 text-white min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">特殊課程列表</h1>
//           <Link
//             href="/admin/SpecialCourseLists/createSpecialCourse"
//             className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700"
//           >
//             建立特別課程
//           </Link>
//         </div>

//         <Link href="/admin" className="text-blue-400 hover:underline mb-4 inline-block">
//           返回
//         </Link>

//         {error && (
//           <div className="bg-red-600 text-white p-4 rounded-md mb-6">
//             {error}
//           </div>
//         )}

//         {isPending ? (
//           <div className="text-center py-10">載入中...</div>
//         ) : SpecialCourseList.length === 0 ? (
//           <div className="text-center py-10 text-gray-400">沒有特殊課程</div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {SpecialCourseList.map((course) => (
//               <div
//                 key={course.id}
//                 className="bg-gray-700 rounded-md p-4 shadow-lg hover:bg-gray-600 transition"
//               >
//                 <h2 className="text-lg font-semibold mb-2">{course.title}</h2>
//                 <p className="text-sm text-gray-300 mb-1">
//                   <span className="font-medium">課程代碼:</span> {course.courseCode}
//                 </p>
//                 <p className="text-sm text-gray-300 mb-1">
//                   <span className="font-medium">學校:</span> {course.schoolName}
//                 </p>
//                 <p className="text-sm text-gray-300 mb-1">
//                   <span className="font-medium">天數:</span> {course.numberOfDays}
//                 </p>
//                 <p className="text-sm text-gray-300 mb-1">
//                   <span className="font-medium">學生數:</span> {course.numberOfStudents}
//                 </p>
//                 <p className="text-sm text-gray-300 mb-1">
//                   <span className="font-medium">開始日期:</span>{" "}
//                   {course.startDate || "未設置"}
//                 </p>
//                 <p className="text-sm text-gray-300 mb-1">
//                   <span className="font-medium">結束日期:</span>{" "}
//                   {course.endDate || "未設置"}
//                 </p>
//                 <p className="text-sm text-gray-300 mb-1">
//                   <span className="font-medium">教師:</span>{" "}
//                   {course.teacher.join(", ") || "無"}
//                 </p>
//                 <p className="text-sm text-gray-300 mb-1">
//                   <span className="font-medium">課室:</span>{" "}
//                   {course.classroom || "未設置"}
//                 </p>
//                 <p className="text-sm text-gray-300 mb-1">
//                   <span className="font-medium">星期:</span>{" "}
//                   {course.weekday || "未設置"}
//                 </p>
//                 <p className="text-sm text-gray-300 mb-1">
//                   <span className="font-medium">課程日期:</span>{" "}
//                   {course.Coursedates.length > 0
//                     ? course.Coursedates.map(formatDateWithDay).join(", ")
//                     : "無"}
//                 </p>
//                 <div className="mt-4">
//                   <Link
//                     href={`/admin/SpecialCourseLists/${course.id}/edit`}
//                     className="px-3 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700"
//                   >
//                     編輯
//                   </Link>
//                   <Link                      
//                   href={`/specialCourse/${course.id}`}
//                   className="px-3 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700">
//                     課程細節
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SpecialCourseLists;


"use client";

import Link from "next/link";
import { useTransition, useEffect, useState } from "react";
import { format } from "date-fns";
import { zhHK } from "date-fns/locale";

interface SpecialCourseData {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  numberOfDays: number;
  numberOfStudents: number;
  maxStudents: number | null; // 新增
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
  Students: string[]; // 新增
}

const SpecialCourseLists = () => {
  const [SpecialCourseList, setSpecialCourseList] = useState<SpecialCourseData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchData = async () => {
      startTransition(async () => {
        try {
          const response = await fetch("/api/SpecialCourse/SpecialCourse_Lists");
          if (!response.ok) {
            throw new Error(`請求失敗: ${response.status}`);
          }
          const data = await response.json();
          setSpecialCourseList(data);
        } catch {
          setError("無法獲取特殊課程數據");
        }
      });
    };
    fetchData();
  }, []);

  // 格式化日期並添加星期
  const formatDateWithDay = (dateStr?: string | null) => {
    if (!dateStr) return "未設置";
    try {
      const date = new Date(dateStr);
      return `${format(date, "yyyy-MM-dd", { locale: zhHK })} (${format(date, "EEEE", { locale: zhHK })})`;
    } catch {
      return "無效日期";
    }
  };

  // 檢查課程是否已滿
  const isCourseFull = (course: SpecialCourseData) => {
    if (course.maxStudents === null || course.maxStudents === undefined) {
      return false; // 如果未設置上限，視為未滿
    }
    return course.Students.length >= course.maxStudents;
  };

  console.log("SpecialCourseList : ", SpecialCourseList, "-- End --");

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">特殊課程列表</h1>
          <Link
            href="/admin/SpecialCourseLists/createSpecialCourse"
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            建立特別課程
          </Link>
        </div>

        <Link href="/admin" className="text-blue-400 hover:underline mb-4 inline-block">
          返回
        </Link>

        {error && (
          <div className="bg-red-600 text-white p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {isPending ? (
          <div className="text-center py-10">載入中...</div>
        ) : SpecialCourseList.length === 0 ? (
          <div className="text-center py-10 text-gray-400">沒有特殊課程</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SpecialCourseList.map((course) => (
              <div
                key={course.id}
                className="bg-gray-700 rounded-md p-4 shadow-lg hover:bg-gray-600 transition"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold mb-2">{course.title}</h2>
                  {isCourseFull(course) && (
                    <span className="text-sm text-red-400 font-medium bg-red-900 px-2 py-1 rounded">
                      已滿
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium">課程代碼:</span> {course.courseCode}
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium">學校:</span> {course.schoolName}
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium">天數:</span> {course.numberOfDays}
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium">學生數:</span> {course.Students.length} /{" "}
                  {course.maxStudents ?? "無上限"}
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium">開始日期:</span>{" "}
                  {course.startDate ? formatDateWithDay(course.startDate) : "未設置"}
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium">結束日期:</span>{" "}
                  {course.endDate ? formatDateWithDay(course.endDate) : "未設置"}
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium">教師:</span>{" "}
                  {course.teacher.join(", ") || "無"}
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium">課室:</span>{" "}
                  {course.classroom || "未設置"}
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium">星期:</span>{" "}
                  {course.weekday || "未設置"}
                </p>
                <p className="text-sm text-gray-300 mb-1">
                  <span className="font-medium">課程日期:</span>{" "}
                  {course.Coursedates.length > 0
                    ? course.Coursedates.map(formatDateWithDay).join(", ")
                    : "無"}
                </p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/admin/SpecialCourseLists/${course.id}/edit`}
                    className="px-3 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    編輯
                  </Link>
                  <Link
                    href={`/specialCourse/${course.id}`}
                    className="px-3 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    課程細節
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialCourseLists;