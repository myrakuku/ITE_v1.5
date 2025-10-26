"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface UserDataLists {
  id: string;
  username: string;
  phone: string | null; // 允許 null
  name: string | null; // 允許 null
  email: string | null; // 允許 null
  role: string;
}

const UserListsPage = () => {
  const [getUserDataLists, setGetUserDataLists] = useState<UserDataLists[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUserDataLists = async () => {
      try {
        const response = await fetch("/api/user/Get_User_Lists");
        if (!response.ok) {
          throw new Error(`API 錯誤: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setGetUserDataLists(data);
      } catch (error) {
        console.error("fetchUserDataLists error:", error);
        setError(error instanceof Error ? error.message : "無法獲取用戶數據");
      }
    };
    fetchUserDataLists();
  }, []);

  console.log("getUserDataLists:", getUserDataLists, "-- End --");

  // 搜尋和過濾用戶，處理 null 值
  const filteredUsers = getUserDataLists.filter(
    (user) =>
      (user.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (user.username?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (user.email?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (user.role?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  // 分頁邏輯
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 標題與創建用戶按鈕 */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">用戶列表</h1>
          <Link
            href="/admin/UserLists/createUser"
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
          >
            建立用戶
          </Link>
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="mb-4 text-red-500 p-4 bg-red-900/50 rounded-md">
            {error}
          </div>
        )}

        {/* 搜尋框 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="搜尋用戶名稱、用戶名、電郵或角色..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // 重置到第一頁
            }}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* 用戶列表 */}
        <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden mb-6">
          {paginatedUsers.length === 0 ? (
            <p className="p-4 text-gray-400">無用戶數據或正在加載...</p>
          ) : (
            <div className="divide-y divide-gray-700">
              {paginatedUsers.map((user) => (
                <Link
                  key={user.id}
                  href={`/admin/UserLists/${user.id}`}
                  className="block px-4 py-3 hover:bg-gray-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base font-medium">{user.name || "無名稱"}</div>
                      <div className="text-sm text-gray-400">{user.username}</div>
                    </div>
                    <div className="text-sm text-gray-400 text-right">
                      <div>{user.email || "無電郵"}</div>
                      <div>角色: {user.role}</div>
                      <div>電話: {user.phone || "無"}</div>
                    </div>
                  </div>
                </Link>
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

export default UserListsPage;