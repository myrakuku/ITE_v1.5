// app/actions/auth/login.ts
"use server";

import { signIn } from "@/auth"; // 匯入 NextAuth 的 signIn
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function serverLogin(formData: FormData) {
  const data = schema.safeParse({
    username: formData.get("username")?.toString(),
    password: formData.get("password")?.toString(),
  });

  if (!data.success) return { error: data.error.errors[0].message };

  const { username, password } = data.data;

  const user = await db.user.findUnique({
    where: { username },
    select: { id: true, password: true, role: true },
  });

  if (!user?.password) return { error: "帳號或密碼錯誤" };

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return { error: "帳號或密碼錯誤" };

  // 使用 NextAuth 的 signIn（在 Server Action 中安全）
  try {
    await signIn("credentials", {
      username,
      password,
      redirect: false, // 不要自動跳轉
    });
    return { success: true };
  } catch (error) {
    return { error: "登入失敗，請稍後重試" };
  }
}


// "use server";

// import { AuthError } from "next-auth";
// import bcrypt from "bcryptjs";
// import { db } from "@/lib/db";
// import { signIn } from "@/auth";
// import { z } from "zod";
// import { UserRole } from "@/auth-options";


// const loginSchema = z.object({
//   username: z.string().min(1, "請提供用戶名"),
//   password: z.string().min(1, "請提供密碼"),
// });



// export async function serverLogin(formData: FormData) {
//   try {
//     const parsedData = loginSchema.safeParse({
//       username: formData.get("username")?.toString(),
//       password: formData.get("password")?.toString(),
//     });

//     if (!parsedData.success) {
//       return { error: parsedData.error.errors[0].message };
//     }

//     const { username, password } = parsedData.data;

//     const user = await db.user.findUnique({
//       where: { username },
//       select: { id: true, username: true, password: true, role: true },
//     });

//     if (!user || !user.password) {
//       return { error: "用戶名或密碼錯誤" };
//     }

//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) {
//       return { error: "用戶名或密碼錯誤" };
//     }

//     console.log("嘗試憑證登入:", { username });

//     const result = await signIn("credentials", {
//       username,
//       password,
//       redirect: false,
//     });

//     if (result?.error) {
//       console.error("NextAuth signIn 錯誤:", result.error);
//       return { error: "登入失敗，請稍後重試" };
//     }

//     return {
//       success: true,
//       user: { id: user.id, role: user.role as UserRole },
//     };
//   } catch (error) {
//     console.error("serverLogin 錯誤:", error);
//     if (error instanceof AuthError) {
//       return { error: error.message };
//     }
//     return { error: "登入失敗，請稍後重試" };
//   }
// }