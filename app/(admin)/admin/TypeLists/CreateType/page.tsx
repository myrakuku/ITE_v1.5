"use client";

import CreateTypeForm_admin from "@/components/CreateForm/Create-Type_admin_Form";
import Link from "next/link";

const CreateTypePage = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 標題與返回按鈕 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">創建類型</h1>
          <Link
            href="/admin/TypeLists"
            className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm font-medium hover:bg-gray-600 transition"
          >
            返回類型列表
          </Link>
        </div>
        <div className="bg-gray-800 shadow-lg rounded-lg p-6">
          <CreateTypeForm_admin />
        </div>
      </div>
    </div>
  );
};

export default CreateTypePage;