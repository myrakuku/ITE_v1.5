// "use server";

// import { AuthError } from "next-auth";
// import bcrypt from "bcryptjs";
// import { db } from "@/lib/db";
// import { signIn } from "@/auth";

// export async function serverLogin(formData: FormData) {
//   try {
//     const username = formData.get("username")?.toString();
//     const password = formData.get("password")?.toString();

//     if (!username || !password) {
//       return { error: "請提供用戶名和密碼" };
//     }

//     const user = await db.user.findUnique({
//       where: { username },
//     });

//     if (!user || !user.password) {
//       return { error: "用戶名或密碼錯誤" };
//     }

//     const isValid = await bcrypt.compare(password, user.password);
//     if (!isValid) {
//       return { error: "用戶名或密碼錯誤" };
//     }

//     await signIn("credentials", {
//       username,
//       password,
//       redirect: false,
//     });

//     return { success: true };
//   } catch (error) {
//     if (error instanceof AuthError) {
//       return { error: error.message }; // 確保返回字符串
//     }
//     return { error: "登入失敗，請稍後重試" ,error};
//   }
// }



"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signIn } from "@/auth";

export async function serverLogin(formData: FormData) {
  try {
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();

    if (!username || !password) {
      return { error: "請提供用戶名和密碼" };
    }

    const user = await db.user.findUnique({
      where: { username },
      select: { id: true, username: true, password: true, role: true },
    });

    if (!user || !user.password) {
      return { error: "用戶名或密碼錯誤" };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { error: "用戶名或密碼錯誤" };
    }

    await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    return {
      success: true,
      user: { id: user.id, role: user.role },
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.message };
    }
    console.error("Login error:", error);
    return { error: "登入失敗，請稍後重試" };
  }
}