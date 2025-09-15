"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

interface Course {
  id: string;
  title: string;
  Coursedates: string[];
  timeHours: number;
  courseTimeRanges: {
    id: string;
    starttime: string | null;
    endtime: string | null;
  }[];
}

interface CourseDisplayData {
  id: string;
  title: string;
  date: string;
  timeHours: number;
  starttime: string | null;
  endtime: string | null;
}

const TeacherAccountsPage = () => {
  const params = useParams();
  const teacherId = params.Teacherid as string;
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, "0"));
  const [courses, setCourses] = useState<CourseDisplayData[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // 生成年份選項（當前年份 ±5 年）
  const years = Array.from({ length: 11 }, (_, i) => (new Date().getFullYear() - 5 + i).toString());
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));

  // 使用 useCallback 包裹 fetchCourses
  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/Course/Get_Courses_By_Teacher?teacherId=${teacherId}&year=${year}&month=${month}`
      );
      if (!response.ok) {
        throw new Error(`API 錯誤: ${response.status}`);
      }
      const data: Course[] = await response.json();

      // 按日期展開課程數據
      const displayData: CourseDisplayData[] = [];
      data.forEach((course) => {
        course.Coursedates.forEach((date) => {
          // 安全檢查 courseTimeRanges
          const timeRange =
            course.courseTimeRanges && course.courseTimeRanges.length > 0
              ? course.courseTimeRanges[0]
              : { starttime: null, endtime: null };
          displayData.push({
            id: course.id,
            title: course.title,
            date,
            timeHours: course.timeHours,
            starttime: timeRange.starttime,
            endtime: timeRange.endtime,
          });
        });
      });

      // 計算總時數
      const total = displayData.reduce((sum, course) => sum + course.timeHours, 0);
      setCourses(displayData);
      setTotalHours(total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "無法載入課程數據");
    }
  }, [teacherId, year, month]); // 依賴 teacherId, year, month

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]); // 將 fetchCourses 加入依賴陣列

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="bg-red-600 px-4 py-2 rounded-md flex items-center">
          {error}
          <button
            onClick={fetchCourses}
            className="ml-4 px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
          >
            重試
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">教師課程總時數</h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6">
          <div>
            <label className="text-sm font-medium">年份</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-1 block w-full sm:w-40 bg-gray-800 border-gray-700 text-white rounded-md p-2"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">月份</label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="mt-1 block w-full sm:w-40 bg-gray-800 border-gray-700 text-white rounded-md p-2"
            >
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 font-medium text-sm text-gray-400">
            <div>課程名稱</div>
            <div>日期</div>
            <div>開始時間</div>
            <div>結束時間</div>
          </div>
          {courses.length === 0 ? (
            <div className="p-6 text-center text-gray-400">該月無課程數據</div>
          ) : (
            courses.map((course) => (
              <div
                key={`${course.id}-${course.date}`}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 border-t border-gray-700 hover:bg-gray-700"
              >
                <div>{course.title}</div>
                <div>{course.date}</div>
                <div>{course.starttime || "未指定"}</div>
                <div>{course.endtime || "未指定"}</div>
              </div>
            ))
          )}
          <div className="p-6 border-t border-gray-700">
            <p className="text-lg font-semibold">總時數: {totalHours} 小時</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherAccountsPage;