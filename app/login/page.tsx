"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { serverLogin } from "../actions/auth/login"; // 確保路徑正確
import { signIn } from "@/auth"; // 從 auth.ts 導入 signIn
import { useSession } from "next-auth/react";
import { toast } from "sonner"; // 新增 toast 導入

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
      toast.error(result.error); // 使用 toast 顯示錯誤
    } else {
      await update(); // 同步客戶端會話
      const userRole = result.user?.role;
      const userId = result.user?.id;
      if (userRole === "USER" && userId) {
        router.push(`/user/${userId}`);
      } else if (userRole === "TEACHER" && userId) {
        router.push(`/teacher/${userId}`);
      } else if (userRole === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/shop");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", { redirect: false });
      if (result?.error) {
        setError("Google 登入失敗，請稍後再試");
        toast.error("Google 登入失敗，請稍後再試"); // 使用 toast 顯示錯誤
      } else {
        await update(); // 同步客戶端會話
        const session = await fetch("/api/auth/session").then((res) => res.json());
        const userRole = session?.user?.role;
        const userId = session?.user?.id;
        if (userRole === "USER" && userId) {
          router.push(`/user/${userId}`);
        } else if (userRole === "TEACHER" && userId) {
          router.push(`/teacher/${userId}`);
        } else if (userRole === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/shop");
        }
        toast.success("Google 登入成功"); // 使用 toast 顯示成功訊息
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Google 登入失敗，請稍後再試";
      setError(errorMessage);
      toast.error(errorMessage); // 使用 toast 顯示錯誤
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
      <button
        onClick={handleGoogleSignIn}
        className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
      >
        使用 Google 登入
      </button>
      <a href="/forgot-password" className="mt-2 text-sm text-blue-400">
        忘記密碼？
      </a>
    </div>
  );
}
// // app/login/page.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { serverLogin } from "../actions/auth/login"; // 確保路徑正確
// import { signIn } from "@/auth"; // 從 auth.ts 導入 signIn
// import { useSession } from "next-auth/react";

// export default function SignIn() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();
//   const { update } = useSession();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     const formData = new FormData();
//     formData.append("username", username);
//     formData.append("password", password);

//     const result = await serverLogin(formData);

//     if (result.error) {
//       setError(result.error);
//     } else {
//       await update(); // 同步客戶端會話
//       const userRole = result.user?.role;
//       const userId = result.user?.id;
//       if (userRole === "USER" && userId) {
//         router.push(`/user/${userId}`);
//       } else if (userRole === "TEACHER" && userId) {
//         router.push(`/teacher/${userId}`);
//       } else if (userRole === "ADMIN") {
//         router.push("/admin");
//       } else {
//         router.push("/shop");
//       }
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signIn("google", { redirect: false });
//       if (result?.error) {
//         setError("Google 登入失敗，請稍後再試");
//       } else {
//         // Google 登入成功後，依賴 session 回調進行重定向
//         await update();
//         // 由於 session 回調已處理角色，我們需要在客戶端檢查角色並重定向
//         const session = await fetch("/api/auth/session").then((res) => res.json());
//         const userRole = session?.user?.role;
//         const userId = session?.user?.id;
//         if (userRole === "USER" && userId) {
//           router.push(`/user/${userId}`);
//         } else if (userRole === "TEACHER" && userId) {
//           router.push(`/teacher/${userId}`);
//         } else if (userRole === "ADMIN") {
//           router.push("/admin");
//         } else {
//           router.push("/shop");
//         }
//       }
//     } catch (error) {
//       setError("Google 登入失敗，請稍後再試");
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">登入</h1>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm">
//         <input
//           type="text"
//           placeholder="用戶名"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           className="border p-2 bg-gray-700 text-white border-gray-600 focus:border-gray-500 rounded-md"
//         />
//         <input
//           type="password"
//           placeholder="密碼"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="border p-2 bg-gray-700 text-white border-gray-600 focus:border-gray-500 rounded-md"
//         />
//         {error && <p className="text-red-400">{error}</p>}
//         <button
//           type="submit"
//           className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
//         >
//           登入
//         </button>
//       </form>
//       <button
//         onClick={handleGoogleSignIn}
//         className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
//       >
//         使用 Google 登入
//       </button>
//       <a href="/forgot-password" className="mt-2 text-sm text-blue-400">
//         忘記密碼？
//       </a>
//     </div>
//   );
// }