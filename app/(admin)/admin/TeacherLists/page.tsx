"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface TeacherData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const TeacherListsPage = () => {
  const [getTeacherDataLists, setGetTeacherDataLists] = useState<TeacherData[]>([]);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch("/api/user/Get_User_Lists");
        if (!response.ok) {
          throw new Error("Failed to fetch teacher data");
        }
        const data = await response.json();
        setGetTeacherDataLists(data);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };
    fetchTeacherData();
  }, []);

  console.log("getTeacherDataLists:", getTeacherDataLists, "-- End --");

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 標題與創建按鈕 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">教師列表</h1>
          <Link
            href="/admin/TeacherLists/CreateTeacher"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            建立老師
          </Link>
        </div>

        {/* 教師列表 */}
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          {getTeacherDataLists.length === 0 ? (
            <p className="p-4 text-gray-400">正在加載或無教師數據...</p>
          ) : (
            <div className="divide-y divide-gray-700">
              {getTeacherDataLists.map(
                (teacher) =>
                  teacher.role === "TEACHER" && (
                    <Link
                      key={teacher.id}
                      href={`/admin/TeacherLists/${teacher.id}`}
                      className="block px-4 py-3 hover:bg-gray-700 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-medium">{teacher.name}</span>
                        <span className="text-sm text-gray-400">{teacher.email}</span>
                      </div>
                    </Link>
                  )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherListsPage;