"use client";

import { deleteHeaderType } from "@/app/actions/Delete/Delete_HeaderType";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

interface HeaderTypeData {
  id: string;
  HeaderTypeName: string;
}

const HeaderTypePage = () => {
  const [getHeaderTypeDataLists, setGetHeaderTypeDataLists] = useState<HeaderTypeData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const headerTypesPerPage = 10;

  useEffect(() => {
    const fetchHeaderTypeDataLists = async () => {
      try {
        const response = await fetch("/api/Type/Get_HeaderType_Lists");
        if (!response.ok) {
          throw new Error(`請求失敗: ${response.status}`);
        }
        const data = await response.json();
        setGetHeaderTypeDataLists(data);
      } catch (error) {
        console.error("Error fetching header types:", error);
        setError("無法獲取關鍵字數據");
      }
    };
    fetchHeaderTypeDataLists();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("確定要刪除這個關鍵字嗎？")) return;

    startTransition(async () => {
      try {
        await deleteHeaderType(id);
        setGetHeaderTypeDataLists((prev) => prev.filter((item) => item.id !== id));
        alert("關鍵字已成功刪除！");
      } catch (error) {
        console.error("Error deleting header type:", error);
        alert(
          error instanceof Error
            ? `刪除失敗：${error.message}`
            : "刪除時發生錯誤，請稍後再試。"
        );
      }
    });
  };

  // 搜尋和過濾關鍵字
  const filteredHeaderTypes = getHeaderTypeDataLists.filter((headerType) =>
    headerType.HeaderTypeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 分頁邏輯
  const totalHeaderTypes = filteredHeaderTypes.length;
  const totalPages = Math.ceil(totalHeaderTypes / headerTypesPerPage);
  const paginatedHeaderTypes = filteredHeaderTypes.slice(
    (currentPage - 1) * headerTypesPerPage,
    currentPage * headerTypesPerPage
  );

  console.log("getHeaderTypeDataLists :" , getHeaderTypeDataLists , "-- End --")

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 標題與創建按鈕 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">關鍵字列表</h1>
          <Link
            href="/admin/HeaderTypeLists/CreateHeaderType"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            建立關鍵字
          </Link>
        </div>

        {/* 錯誤訊息 */}
        {error && <div className="mb-4 text-red-500">{error}</div>}

        {/* 搜尋框 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="搜尋關鍵字名稱..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // 重置到第一頁
            }}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* 關鍵字列表 */}
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-6">
          {paginatedHeaderTypes.length === 0 ? (
            <p className="p-4 text-gray-400 flex items-center">
              {getHeaderTypeDataLists.length === 0 && !error ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z" />
                  </svg>
                  正在加載...
                </>
              ) : (
                "無關鍵字數據"
              )}
            </p>
          ) : (
            <div className="divide-y divide-gray-700">
              {paginatedHeaderTypes.map((headerType) => (
                <div
                  key={headerType.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-700 transition"
                >
                  <span className="text-base font-medium">{headerType.HeaderTypeName}</span>
                  <button
                    onClick={() => handleDelete(headerType.id)}
                    disabled={isPending}
                    className="px-3 py-1 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition"
                  >
                    {isPending ? "刪除中..." : "刪除"}
                  </button>
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
};

export default HeaderTypePage;