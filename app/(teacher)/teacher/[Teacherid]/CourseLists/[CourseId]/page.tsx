"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface CourseData {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  CourseTypes: string | null;
  Coursedates: string[];
  classroom: string | null;
  courseModulId: string | null;
  createdAt: string;
  updatedAt: string;
  endDate: string;
  isProduct: boolean;
  isPublic: boolean;
  numberOfDays: number;
  startDate: string;
  teacher: string[];
  teacherId: string;
  timeHours: number;
  timeRange: string[];
  type: string[];
  weekday: string | null;
}

const Course_Data_by_Id = () => {
  const params = useParams();
  const TeacherId = params.Teacherid as string;
  const courseId = params.CourseId as string;
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    async function GetCourseDataById() {
      try {
        const res = await fetch(`/api/Course/Get_Course_Lists_by_Id/${courseId}`);
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        setCourseData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "無法載入課程數據");
      }
    }
    GetCourseDataById();
  }, [courseId]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-red-600 px-4 py-2 rounded-md">{error}</div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-lg">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">課程詳情</h1>
        <Link href={`/teacher/${TeacherId}/CourseLists`}>
        <h1 className="text-2xl font-bold mb-6">返回</h1>
        </Link>
        <Link href={`/teacher/${TeacherId}/CourseLists/${courseId}/edit`}>
        <h1 className="text-2xl font-bold mb-6">修改課程</h1>
        </Link>
        <div className="bg-gray-800 shadow-lg rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">基本資訊</h2>
              <p><strong>課程 ID:</strong> {courseData.id}</p>
              <p><strong>標題:</strong> {courseData.title}</p>
              <p><strong>描述:</strong> {courseData.description}</p>
              <p><strong>課程代碼:</strong> {courseData.courseCode}</p>
              <p><strong>學校名稱:</strong> {courseData.schoolName}</p>
              <p><strong>課室:</strong> {courseData.classroom || "未指定"}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">課程細節</h2>
              <p><strong>課程類型:</strong> {courseData.CourseTypes || "無"}</p>
              <p><strong>課程日期:</strong> {courseData.Coursedates.length > 0 ? courseData.Coursedates.join(", ") : "無"}</p>
              <p><strong>開始日期:</strong> {courseData.startDate || "未指定"}</p>
              <p><strong>結束日期:</strong> {courseData.endDate || "未指定"}</p>
              <p><strong>課程天數:</strong> {courseData.numberOfDays}</p>
              <p><strong>課程時數:</strong> {courseData.timeHours}</p>
              <p><strong>時間範圍:</strong> {courseData.timeRange.length > 0 ? courseData.timeRange.join(", ") : "無"}</p>
              <p><strong>星期:</strong> {courseData.weekday || "未指定"}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">教師資訊</h2>
              <p><strong>教師:</strong> {courseData.teacher.length > 0 ? courseData.teacher.join(", ") : "無"}</p>
              <p><strong>教師 ID:</strong> {courseData.teacherId}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">其他資訊</h2>
              <p><strong>課程模組 ID:</strong> {courseData.courseModulId || "無"}</p>
              <p><strong>是否公開:</strong> {courseData.isPublic ? "是" : "否"}</p>
              <p><strong>是否為產品:</strong> {courseData.isProduct ? "是" : "否"}</p>
              <p><strong>類型:</strong> {courseData.type.length > 0 ? courseData.type.join(", ") : "無"}</p>
              <p><strong>創建時間:</strong> {new Date(courseData.createdAt).toLocaleString()}</p>
              <p><strong>更新時間:</strong> {new Date(courseData.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course_Data_by_Id;