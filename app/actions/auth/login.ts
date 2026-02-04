// app/actions/auth/login.ts
"use server";

import { signIn } from "@/auth";
import { z } from "zod";
import { AuthError } from "next-auth";

// Schema 定義
const schema = z.object({
  username: z.string().min(1, "請輸入帳號"),
  password: z.string().min(1, "請輸入密碼"),
});

export async function serverLogin(formData: FormData) {
  // 1. 驗證輸入格式
  const data = schema.safeParse({
    username: formData.get("username")?.toString(),
    password: formData.get("password")?.toString(),
  });

  if (!data.success) {
    return { error: data.error.errors[0].message };
  }

  const { username, password } = data.data;

  try {
    // 2. 直接呼叫 signIn
    // 這會自動觸發 auth.ts 裡的 authorize 函數去查 DB 和比對密碼
    await signIn("credentials", {
      username,
      password,
      redirect: false, // 因為你在前端可能想要手動處理跳轉，或者用 middleware
    });

    return { success: true };

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          // 這就是 authorize 回傳 null 時會跑到的地方
          return { error: "帳號或密碼錯誤" };
        default:
          return { error: "登入發生未知錯誤" };
      }
    }

    // 必須拋出非 AuthError (例如 redirect 相關的錯誤)
    throw error;
  }
}
