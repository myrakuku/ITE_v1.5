"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// 定義課程物件的型別，根據 Prisma 的 Course model
type Course = {
  id: string;
  title: string;
  courseCode: string;
  startDate: string | null;
  description: string;
  schoolName: string;
  endDate: string | null;
  starttime: string | null;
  endtime: string | null;
  timeHours: number;
  teacher: string[];
  teacherId: string;
  isPublic: boolean;
  type: string[];
  courseModulId: string | null;
  createdAt: string;
  updatedAt: string;
  CourseModul?: {
    id: string;
    title: string;
    description: string;
  } | null;
};

const CourseListsByTeacher = () => {
  const params = useParams();
  const TeacherId = params.Teacherid as string;

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`/api/user/teacher/${TeacherId}/CourseLists`);
        if (!res.ok) {
          throw new Error(`API 錯誤: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          // 過濾出 teacherId 與 TeacherId 匹配的課程
          const filteredCourses = data.filter((course: Course) => course.teacherId === TeacherId);
          setCourses(filteredCourses);
        } else {
          console.error("API 返回非陣列資料", data);
          setCourses([]);
        }
      } catch (error) {
        console.error("fetchCourses error:", error);
        setCourses([]);
      }
    };

    fetchCourses();
  }, [TeacherId]);

  console.log("courses: ", courses);

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 標題和創建按鈕 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">教師課程列表</h1>
          <Link
            href={`/teacher/${TeacherId}/CourseLists/CreateCourse`}
            className="px-4 py-2 rounded-md text-sm font-medium bg-gray-700 hover:bg-gray-600 transition"
          >
            建立課程
          </Link>
        </div>

        {/* 課程列表 */}
        {courses.length === 0 ? (
          <p className="text-gray-400">尚未創建任何課程</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/teacher/${TeacherId}/CourseLists/${course.id}`}
                className="block bg-gray-700 p-4 rounded-md shadow-md hover:bg-gray-600 transition"
              >
                <h2 className="text-lg font-semibold">{course.title}</h2>
                <p className="text-sm text-gray-300 mt-2">課程代碼: {course.courseCode}</p>
                <p className="text-sm text-gray-300">
                  開始日期: {course.startDate || "未設定"}
                </p>
                <p className="text-sm text-gray-300">描述: {course.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseListsByTeacher;