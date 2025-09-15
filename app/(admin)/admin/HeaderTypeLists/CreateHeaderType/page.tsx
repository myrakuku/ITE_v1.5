"use client";

import CreateHeaderTypeForm from "@/components/CreateForm/Create-HeaderType-Form";
import Link from "next/link";

const CreateHeaderTypePage = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 標題與返回按鈕 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">創建關鍵字</h1>
          <Link
            href="/admin/HeaderTypeLists"
            className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-medium hover:bg-gray-600 transition"
          >
            返回關鍵字列表
          </Link>
        </div>
        <div className="bg-gray-800 shadow-lg rounded-lg p-6">
          <CreateHeaderTypeForm />
        </div>
      </div>
    </div>
  );
};

export default CreateHeaderTypePage;