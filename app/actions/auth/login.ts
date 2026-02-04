// app/actions/auth/login.ts
"use server";

import { signIn } from "@/auth";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";
import { AuthError } from "next-auth"; // ✅ 1. 這裡要引入 AuthError


const schema = z.object({
  username: z.string().min(1, "請輸入帳號"),
  password: z.string().min(1, "請輸入密碼"),
});

export async function serverLogin(formData: FormData) {
  const data = schema.safeParse({
    username: formData.get("username")?.toString(),
    password: formData.get("password")?.toString(),
  });

  if (!data.success) {
    return { error: data.error.errors[0].message };
  }

  const { username, password } = data.data;

  const user = await db.user.findUnique({
    where: { username },
    select: { id: true, password: true, role: true },
  });

  if (!user?.password) {
    return { error: "帳號或密碼錯誤" };
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return { error: "帳號或密碼錯誤" };
  }

  try {
    await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    // 1. 如果是 NextAuth 的錯誤，可以做特殊處理
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "帳號或密碼錯誤" };
        default:
          return { error: "登入發生未知錯誤" };
      }
    }

    // 2. 如果是 Next.js 的 Redirect 錯誤 (雖然這裡用了 redirect: false，但在某些 adapter 下仍可能發生)
    // 必須把它拋出去，否則跳轉會失效
    // 不過因為你用了 redirect: false，這裡通常不會觸發，但為了代碼健壯性建議保留邏輯
    
    console.error("Server Action Error:", error);
    // 3. 捕捉其他錯誤
    return { error: "系統錯誤，請稍後重試" };
  }
}

