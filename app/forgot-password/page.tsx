// // app/forgot-password/page.tsx
// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";

// const forgotPasswordSchema = z.object({
//   email: z.string().email("請輸入有效的電郵地址"),
// });

// type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

// export default function ForgotPasswordPage() {
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const form = useForm<ForgotPasswordForm>({
//     resolver: zodResolver(forgotPasswordSchema),
//     defaultValues: {
//       email: "",
//     },
//   });

//   const onSubmit = async (data: ForgotPasswordForm) => {
//     try {
//       const response = await fetch("/api/auth/forgot-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email: data.email }),
//       });

//       const result = await response.json();
//       if (result.error) {
//         setError(result.error);
//         setMessage("");
//       } else {
//         setMessage("已發送重置密碼鏈接至您的電郵");
//         setError("");
//       }
//     } catch (error) {
//       setError("發送重置密碼鏈接失敗，請稍後再試");
//       setMessage("");
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">忘記密碼</h1>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-sm">
//         <input
//           type="email"
//           placeholder="電郵地址"
//           {...form.register("email")}
//           className="border p-2 bg-gray-700 text-white border-gray-600 focus:border-gray-500 rounded-md"
//         />
//         {form.formState.errors.email && (
//           <p className="text-red-400">{form.formState.errors.email.message}</p>
//         )}
//         {error && <p className="text-red-400">{error}</p>}
//         {message && <p className="text-green-400">{message}</p>}
//         <button
//           type="submit"
//           className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
//         >
//           發送重置鏈接
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"; // 新增 toast 導入

const forgotPasswordSchema = z.object({
  email: z.string().email("請輸入有效的電郵地址"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();
      if (result.error) {
        setError(result.error);
        setMessage("");
        toast.error(result.error); // 使用 toast 顯示錯誤
      } else {
        setMessage("已發送重置密碼鏈接至您的電郵");
        setError("");
        toast.success("已發送重置密碼鏈接至您的電郵"); // 使用 toast 顯示成功訊息
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "發送重置密碼鏈接失敗，請稍後再試";
      setError(errorMessage);
      setMessage("");
      toast.error(errorMessage); // 使用 toast 顯示錯誤
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">忘記密碼</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-sm">
        <input
          type="email"
          placeholder="電郵地址"
          {...form.register("email")}
          className="border p-2 bg-gray-700 text-white border-gray-600 focus:border-gray-500 rounded-md"
        />
        {form.formState.errors.email && (
          <p className="text-red-400">{form.formState.errors.email.message}</p>
        )}
        {error && <p className="text-red-400">{error}</p>}
        {message && <p className="text-green-400">{message}</p>}
        <button
          type="submit"
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          發送重置鏈接
        </button>
      </form>
    </div>
  );
}