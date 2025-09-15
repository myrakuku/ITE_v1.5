"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

const TeacherPagebyId = () => {
  const params = useParams();
  const TeacherId = params.Teacherid as string;

  console.log("params: ", params);
  console.log("TeacherId: ", TeacherId);

  return (
    <div className="bg-gray-800 text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-6">歡迎，教師 {TeacherId}</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href={`/teacher/${TeacherId}/Accounts`}
            className="block bg-gray-700 p-4 rounded-md shadow-md hover:bg-gray-600 transition"
          >
            <h2 className="text-lg font-semibold">帳戶管理</h2>
            <p className="text-sm text-gray-300">管理您的帳戶信息</p>
          </Link>
          <Link
            href={`/teacher/${TeacherId}/calendar`}
            className="block bg-gray-700 p-4 rounded-md shadow-md hover:bg-gray-600 transition"
          >
            <h2 className="text-lg font-semibold">日曆</h2>
            <p className="text-sm text-gray-300">查看課程日程</p>
          </Link>
          <Link
            href={`/teacher/${TeacherId}/CourseLists`}
            className="block bg-gray-700 p-4 rounded-md shadow-md hover:bg-gray-600 transition"
          >
            <h2 className="text-lg font-semibold">課程列表</h2>
            <p className="text-sm text-gray-300">管理您的課程</p>
          </Link>
          <Link
            href={`/teacher/${TeacherId}/TeachingMaterialsLists`}
            className="block bg-gray-700 p-4 rounded-md shadow-md hover:bg-gray-600 transition"
          >
            <h2 className="text-lg font-semibold">教學材料</h2>
            <p className="text-sm text-gray-300">管理教學資源</p>
          </Link>
          <Link
            href={`/teacher/${TeacherId}/TypesLists`}
            className="block bg-gray-700 p-4 rounded-md shadow-md hover:bg-gray-600 transition"
          >
            <h2 className="text-lg font-semibold">課程類型</h2>
            <p className="text-sm text-gray-300">管理課程類型</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeacherPagebyId;