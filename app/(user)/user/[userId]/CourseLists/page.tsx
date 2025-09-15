"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Course {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  Students: string[];
  teacherId: string;
  createdAt: string;
  updatedAt: string;
}

export default function CourseListsPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id !== userId) {
      router.push("/login");
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, userId, router]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch(`/api/user/Get_User_Courses/${userId}`);
        if (!response.ok) {
          throw new Error(`請求失敗: ${response.status}`);
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError("無法獲取課程數據");
      }
    }
    if (status === "authenticated") {
      fetchCourses();
    }
  }, [status, userId]);

  // 搜尋和過濾課程
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.Students.some((student) => student.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // 分頁邏輯
  const totalCourses = filteredCourses.length;
  const totalPages = Math.ceil(totalCourses / coursesPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  if (status === "loading") {
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

  if (!session || session.user.role !== "USER") {
    return null;
  }

  console.log("courses:", courses, " -- End -- ");

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 標題 */}
        <h1 className="text-2xl font-bold mb-6">我的課程列表</h1>

        {/* 錯誤訊息 */}
        {error && <div className="mb-4 text-red-500">{error}</div>}

        {/* 搜尋框 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="搜尋課程名稱、代碼、學校或學生..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // 重置到第一頁
            }}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* 課程列表 */}
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-6">
          {paginatedCourses.length === 0 ? (
            <p className="p-4 text-gray-400 flex items-center">
              {courses.length === 0 && !error ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                  </svg>
                  正在加載...
                </>
              ) : (
                "無課程數據"
              )}
            </p>
          ) : (
            <div className="divide-y divide-gray-700">
              {paginatedCourses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 hover:bg-gray-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-medium">{course.title}</h2>
                      <p className="text-sm text-gray-400">課程代碼: {course.courseCode}</p>
                      <p className="text-sm text-gray-400">學校: {course.schoolName}</p>
                      <p className="text-sm text-gray-400">學生: {course.Students.join(", ") || "無學生"}</p>
                    </div>
                    <Link
                      href={`/user/${userId}/CourseLists/${course.id}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
                    >
                      查看詳情
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 分頁控制 */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mb-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:bg-gray-600 transition"
            >
              上一頁
            </button>
            <span className="px-3 py-2 text-gray-400">
              第 {currentPage} 頁 / 共 {totalPages} 頁
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:bg-gray-600 transition"
            >
              下一頁
            </button>
          </div>
        )}
      </div>
    </div>
  );
}