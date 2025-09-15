"use client";

import CreateStatueForm from "@/components/CreateForm/Create-Statue_Form";
import Link from "next/link";

const CreateStatuePage = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 標題與返回按鈕 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">創建狀態</h1>
          <Link
            href="/admin/StatueLists"
            className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-medium hover:bg-gray-600 transition"
          >
            返回狀態列表
          </Link>
        </div>
        <div className="bg-gray-800 shadow-lg rounded-lg p-6">
          <CreateStatueForm />
        </div>
      </div>
    </div>
  );
};

export default CreateStatuePage;