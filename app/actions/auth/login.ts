// app/actions/auth/login.ts
"use server";

import { signIn } from "@/auth";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";

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
  } catch (_error: unknown) { // 改用 unknown + ESLint 設定忽略
    console.error("登入錯誤:", _error); // 可選：記錄錯誤
    return { error: "登入失敗，請稍後重試" };
  }
}

