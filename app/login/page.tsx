"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { serverLogin } from "../actions/auth/login"; // 確保路徑正確
import { useSession } from "next-auth/react";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { update } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const result = await serverLogin(formData);

    if (result.error) {
      setError(result.error);
    } else {
      await update(); // 同步客戶端會話
      // 根據角色重定向
      const userRole = result.user?.role;
      const userId = result.user?.id;
      if (userRole === "USER" && userId) {
        router.push(`/user/${userId}`);
      } else if (userRole === "TEACHER" && userId) {
        router.push(`/teacher/${userId}`);
      } else if (userRole === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/shop"); // 其他角色的默認路徑
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">登入</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
        <input
          type="text"
          placeholder="用戶名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 bg-gray-700 text-white border-gray-600 focus:border-gray-500 rounded-md"
        />
        <input
          type="password"
          placeholder="密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 bg-gray-700 text-white border-gray-600 focus:border-gray-500 rounded-md"
        />
        {error && <p className="text-red-400">{error}</p>}
        <button
          type="submit"
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          登入
        </button>
      </form>
    </div>
  );
}