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

interface SpecialCourse {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  numberOfDays: number;
  timeHours: number;
  teacher: string[];
  isPublic: boolean;
  price?: number;
  real_price?: number;
  Coursedates: string[];
  startDate: string | null;
  endDate: string | null;
  classroom?: string;
  weekday?: string;
}

interface UserData {
  Course: Course[];
  specialCourse: SpecialCourse[];
}

export default function CourseListsPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;

  const [courses, setCourses] = useState<Course[]>([]);
  const [specialCourses, setSpecialCourses] = useState<SpecialCourse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  console.log("params : ",params,"-- End --")

  // 權限檢查
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id !== userId) {
      router.push("/login");
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, userId, router]);

// 取得普通課程
useEffect(() => {
  async function fetchCourses() {
    try {
      const response = await fetch(`/api/user/Get_User_Courses/${userId}`);
      console.log("response - C: ", response);

      if (!response.ok) throw new Error(`請求失敗: ${response.status}`);

      const data = await response.json();
      console.log("API Get_User_Courses 回傳資料:", data); // 關鍵！

      // 防呆：確保是陣列
      const courseArray = Array.isArray(data) ? data : data?.Course || data?.courses || [];
      setCourses(courseArray);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("無法獲取普通課程");
    }
  }
  if (userId) fetchCourses();
}, [userId]);

// 取得 specialCourse
useEffect(() => {
  async function fetchUserWithSpecialCourses() {
    try {
      const response = await fetch(`/api/user/Get_User_Lists_by_Id/${userId}`);
      console.log("response - SC: ", response);

      if (!response.ok) throw new Error(`請求失敗: ${response.status}`);

      const data = await response.json();
      console.log("API Get_User_Lists_by_Id 回傳資料:", data); // 關鍵！

      // 防呆：確保有 specialCourse 陣列
      const specialArray = data?.specialCourse || data?.specialCourses || [];
      setSpecialCourses(specialArray);
    } catch (error) {
      console.error("Error fetching special courses:", error);
      setError("無法獲取特殊課程");
    }
  }
  if (userId) fetchUserWithSpecialCourses();
}, [userId]);


  console.log("courses : ", courses,"-- End --");
  console.log("specialCourses : ", specialCourses,"-- End --");
  console.log("status :",status,"-- End --")

  // 合併搜尋（普通 + special）
  const allItems = [
    ...courses.map(c => ({ ...c, type: "course" as const })),
    ...specialCourses.map(sc => ({ ...sc, type: "special" as const, Students: [] as string[] }))
  ];

  const filteredItems = allItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.courseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.schoolName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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

  if (!session || session.user.role !== "USER") return null;

  console.log("paginatedItems : ", paginatedItems,"-- End --")

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-6">我的課程列表</h1>

        {error && <div className="mb-4 text-red-500">{error}</div>}

        {/* 搜尋框 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="搜尋課程名稱、代碼、學校..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* 課程列表 */}
        <div className="space-y-6">
          {paginatedItems.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              {allItems.length === 0 ? "您尚未報讀任何課程" : "無符合搜尋條件的課程"}
            </p>
          ) : (
            paginatedItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800 shadow-lg rounded-lg p-4 hover:bg-gray-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.type === "course" ? "bg-blue-600" : "bg-purple-600"
                      }`}>
                        {item.type === "course" ? "課程" : "課程_"}
                      </span>
                      <h2 className="text-lg font-semibold">{item.title}</h2>
                    </div>
                    <div className="text-sm text-gray-400 space-y-1">
                      <p>課程代碼: {item.courseCode || "N/A"}</p>
                      <p>學校: {item.schoolName || "N/A"}</p>
                      {item.type === "course" && (
                        <p>學生: {item.Students?.join(", ") || "無"}</p>
                      )}
                      {item.type === "special" && (
                        <>
                          <p>天數: {item.numberOfDays} 天 | 時數: {item.timeHours} 小時</p>
                          <p>價格: ${item.price || item.real_price || "未定"}</p>
                          {item.Coursedates?.length > 0 && (
                            <p>日期: {new Date(item.Coursedates[0]).toLocaleDateString()}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                    <Link
                      href={
                        item.type === "course"
                          ? `/user/${userId}/CourseLists/${item.id}`
                          : `/user/${userId}/CourseLists/SCourse/${item.id}`
                      }
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition whitespace-nowrap"
                    >
                      查看詳情
                    </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 分頁 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:bg-gray-600 transition"
            >
              上一頁
            </button>
            <span className="text-gray-400">
              第 {currentPage} / {totalPages} 頁
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:bg-gray-600 transition"
            >
              下一頁
            </button>
          </div>
        )}
      </div>
    </div>
  );
}