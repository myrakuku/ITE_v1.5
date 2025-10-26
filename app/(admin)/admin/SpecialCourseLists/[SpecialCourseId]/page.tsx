"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
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
  CourseTimeRanges?: {
    id: string;
    timeRange: "morning" | "afternoon" | "evening" | "full_day";
    starttime: string | null;
    endtime: string | null;
  }[];
}

const SpecialCourseById = () => {
  const params = useParams();
  const specialCourseId = params.specialCourseId as string;
  const [specialCourseData, setSpecialCourseData] = useState<SpecialCourseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  

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
      } catch (err) {
        setError(err instanceof Error ? err.message : "無法獲取特殊課程數據");
      } finally {
        setIsLoading(false);
      }
    };

    if (specialCourseId) {
      fetchSpecialCourseData();
    }
  }, [specialCourseId]);


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

  console.log("specialCourseData : ", specialCourseData, "-- End --");

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">特殊課程詳情</h1>
          <Link
            href="/admin/SpecialCourseLists"
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700"
          >
            返回課程列表
          </Link>
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
              {formatDateWithDay(specialCourseData.startDate) || "未設置"}
            </p>
            <p className="text-sm text-gray-300 mb-2">
              <span className="font-medium">結束日期:</span>{" "}
              {formatDateWithDay(specialCourseData.endDate) || "未設置"}
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
            {specialCourseData.CourseTimeRanges && specialCourseData.CourseTimeRanges.length > 0 && (
              <div className="mt-4">
                <h3 className="text-md font-semibold mb-2">時間範圍</h3>
                {specialCourseData.CourseTimeRanges.map((tr) => (
                  <p key={tr.id} className="text-sm text-gray-300 mb-1">
                    <span className="font-medium">{tr.timeRange}:</span>{" "}
                    {tr.starttime || "未設置"} - {tr.endtime || "未設置"}
                  </p>
                ))}
              </div>
            )}
            <div className="mt-6">
              <Link
                href={`/admin/SpecialCourseLists/${specialCourseData.id}/edit`}
                className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium hover:bg-blue-700"
              >
                加入圖片/照片
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialCourseById;