"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "密碼必須至少 6 個字符"),
    confirmPassword: z.string().min(6, "確認密碼必須至少 6 個字符"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密碼和確認密碼不匹配",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      if (!token) {
        setError("無效的重置密碼鏈接");
        toast.error("無效的重置密碼鏈接");
        return;
      }

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });

      const result = await response.json();
      if (result.error) {
        setError(result.error);
        setMessage("");
        toast.error(result.error);
      } else {
        setMessage("密碼重置成功，請使用新密碼登入");
        setError("");
        toast.success("密碼重置成功，請使用新密碼登入");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "重置密碼失敗，請稍後再試";
      setError(errorMessage);
      setMessage("");
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">重置密碼</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-sm">
        <input
          type="password"
          placeholder="新密碼"
          {...form.register("password")}
          className="border p-2 bg-gray-700 text-white border-gray-600 focus:border-gray-500 rounded-md"
        />
        {form.formState.errors.password && (
          <p className="text-red-400">{form.formState.errors.password.message}</p>
        )}
        <input
          type="password"
          placeholder="確認新密碼"
          {...form.register("confirmPassword")}
          className="border p-2 bg-gray-700 text-white border-gray-600 focus:border-gray-500 rounded-md"
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-red-400">{form.formState.errors.confirmPassword.message}</p>
        )}
        {error && <p className="text-red-400">{error}</p>}
        {message && <p className="text-green-400">{message}</p>}
        <button
          type="submit"
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          重置密碼
        </button>
      </form>
    </div>
  );
}