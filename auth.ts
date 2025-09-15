// // auth.ts
// import NextAuth from 'next-auth';
// import { PrismaAdapter } from '@auth/prisma-adapter';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import bcrypt from 'bcryptjs';
// import { db } from './lib/db';
// import { z } from 'zod';

// // 定義憑證驗證的 schema
// const credentialsSchema = z.object({
//   username: z.string().min(1, '用戶名不能為空'),
//   password: z.string().min(1, '密碼不能為空'),
// });

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(db),
//   session: {
//     strategy: 'jwt',
//     maxAge: 30 * 24 * 60 * 60, // 30 天
//     updateAge: 24 * 60 * 60, // 24 小時
//   },
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         username: { label: '用戶名', type: 'text' },
//         password: { label: '密碼', type: 'password' },
//       },
//       async authorize(credentials) {
//         // 使用 zod 驗證憑證
//         const parsedCredentials = credentialsSchema.safeParse(credentials);
//         if (!parsedCredentials.success) {
//           throw new Error('無效的輸入資料');
//         }

//         const { username, password } = parsedCredentials.data;

//         // 查詢用戶
//         const user = await db.user.findUnique({
//           where: { username },
//         });

//         if (!user || !user.password) {
//           throw new Error('用戶不存在或密碼無效');
//         }

//         // 驗證密碼
//         const passwordsMatch = await bcrypt.compare(password, user.password);
//         if (!passwordsMatch) {
//           throw new Error('密碼錯誤');
//         }

//         // 返回用戶資料
//         return {
//           id: user.id,
//           name: user.username,
//           role: user.role,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.name = user.name;
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id!;
//         session.user.name = token.name ?? 'Unknown';
//         session.user.role = token.role;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: '/login',
//   },
// });

// import NextAuth, { NextAuthConfig } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import { db } from "./lib/db";
// import { z } from "zod";
// import { UserRole } from "@prisma/client";
// import { CustomPrismaAdapter } from "./lib/customPrismaAdaoter";


// // 定義憑證驗證的 schema
// const credentialsSchema = z.object({
//   username: z.string().min(1, "用戶名不能為空"),
//   password: z.string().min(1, "密碼不能為空"),
// });

// // 擴展 NextAuth 的 Session 和 User 類型
// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name: string | null;
//       role: UserRole; // 與 Prisma schema 一致，role 是必填
//       email: string | null;
//       emailVerified: Date | null;
//     };
//   }

//   interface User {
//     id: string;
//     name: string | null;
//     role?: UserRole; // 改為必填，與 Prisma schema 一致
//     email: string | null;
//     emailVerified: Date | null;
//   }
// }

// export const authOptions: NextAuthConfig = {
//   adapter: CustomPrismaAdapter(db),
//   session: {
//     strategy: "jwt" as const, // 明確指定為 "jwt"，避免型別推斷為 string
//     maxAge: 30 * 24 * 60 * 60, // 30 天
//     updateAge: 24 * 60 * 60, // 24 小時
//   },
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "用戶名", type: "text" },
//         password: { label: "密碼", type: "password" },
//       },
//       async authorize(credentials) {
//         const parsedCredentials = credentialsSchema.safeParse(credentials);
//         if (!parsedCredentials.success) {
//           throw new Error("無效的輸入資料");
//         }

//         const { username, password } = parsedCredentials.data;

//         const user = await db.user.findUnique({
//           where: { username },
//         });

//         if (!user || !user.password) {
//           throw new Error("用戶不存在或密碼無效");
//         }

//         const passwordsMatch = await bcrypt.compare(password, user.password);
//         if (!passwordsMatch) {
//           throw new Error("密碼錯誤");
//         }

//         return {
//           id: user.id,
//           name: user.name ?? "Unknown",
//           role: user.role, // role 是必填
//           email: user.email ?? null,
//           emailVerified: user.emailVerified ?? null,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }: { token: any; user?: any }) {
//       if (user) {
//         token.id = user.id;
//         token.name = user.name ?? "Unknown";
//         token.role = user.role;
//         token.email = user.email ?? null;
//         token.emailVerified = user.emailVerified ?? null;
//       }
//       return token;
//     },
//     async session({ session, token }: { session: any; token: any }) {
//       if (token) {
//         session.user = {
//           id: token.id as string,
//           name: token.name as string | null,
//           role: token.role as UserRole,
//           email: token.email as string | null,
//           emailVerified: token.emailVerified as Date | null,
//         };
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/login",
//   },
// };

// export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);




// // auth.ts
// import { AuthConfig, Session, User } from "@auth/core/types";
// import { JWT } from "@auth/core/jwt";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import CredentialsProvider from "@auth/core/providers/credentials";
// import bcrypt from "bcryptjs";
// import { db } from "./lib/db";
// import { z } from "zod";

// // 定義 UserRole 枚舉，與 Prisma 模式保持一致
// export enum UserRole {
//   USER = "USER",
//   ADMIN = "ADMIN",
//   TEACHER = "TEACHER",
// }

// // 擴展 NextAuth 的 Session 和 User 類型
// declare module "@auth/core/types" {
//   interface Session {
//     user: {
//       id: string;
//       name: string;
//       role: UserRole;
//     };
//   }

//   interface User {
//     id: string;
//     name: string | null;
//     role?: UserRole;
//   }
// }

// // 擴展 AdapterUser 以移除 email 和 emailVerified
// declare module "@auth/core/adapters" {
//   interface AdapterUser {
//     id: string;
//     name: string | null;
//     role: UserRole;
//   }
// }

// // 定義憑證驗證的 schema
// const credentialsSchema = z.object({
//   username: z.string().min(1, "用戶名不能為空"),
//   password: z.string().min(1, "密碼不能為空"),
// });

// // 導出 authOptions 作為 AuthConfig
// export const authOptions: AuthConfig = {
//   adapter: PrismaAdapter(db),
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 天
//     updateAge: 24 * 60 * 60, // 24 小時
//   },
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         username: { label: "用戶名", type: "text" },
//         password: { label: "密碼", type: "password" },
//       },
//       async authorize(credentials) {
//         const parsedCredentials = credentialsSchema.safeParse(credentials);
//         if (!parsedCredentials.success) {
//           throw new Error("無效的輸入資料");
//         }

//         const { username, password } = parsedCredentials.data;

//         const user = await db.user.findUnique({
//           where: { username },
//         });

//         if (!user || !user.password) {
//           throw new Error("用戶不存在或密碼無效");
//         }

//         const passwordsMatch = await bcrypt.compare(password, user.password);
//         if (!passwordsMatch) {
//           throw new Error("密碼錯誤");
//         }

//         return {
//           id: user.id,
//           name: user.name,
//           role: user.role as UserRole,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }: { token: JWT; user?: User }) {
//       if (user) {
//         token.id = user.id;
//         token.name = user.name ?? "Unknown";
//         token.role = user.role;
//       }
//       return token;
//     },
//     async session({ session, token }: { session: Session; token: JWT }) {
//       if (token) {
//         session.user = {
//           id: token.id as string,
//           name: token.name as string,
//           role: token.role as UserRole,
//         };
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/login",
//   },
// };

// // 導出 NextAuth 結果
// import NextAuth from "next-auth"
// export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);



// auth.ts
import { AuthConfig, DefaultSession, DefaultUser } from "@auth/core/types";
import { JWT } from "@auth/core/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "@auth/core/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./lib/db";
import { z } from "zod";

// 定義 UserRole 枚舉，與 Prisma 模式保持一致
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
}

// 定義憑證驗證的 schema
const credentialsSchema = z.object({
  username: z.string().min(1, "用戶名不能為空"),
  password: z.string().min(1, "密碼不能為空"),
});

// 導出 authOptions 作為 AuthConfig
export const authOptions: AuthConfig = {
  adapter: PrismaAdapter(db) as any,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 天
    updateAge: 24 * 60 * 60, // 24 小時
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "用戶名", type: "text" },
        password: { label: "密碼", type: "password" },
      },
      async authorize(credentials) {
        try {
          const parsedCredentials = credentialsSchema.safeParse(credentials);
          if (!parsedCredentials.success) {
            throw new Error("無效的輸入資料");
          }

          const { username, password } = parsedCredentials.data;

          const user = await db.user.findUnique({
            where: { username },
          });

          if (!user || !user.password) {
            throw new Error("用戶不存在或密碼無效");
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            throw new Error("密碼錯誤");
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email, // 保持 email 字段
            role: user.role as UserRole,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // 用戶首次登入時，將用戶信息添加到 token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // 添加錯誤頁面
  },
  trustHost: true, // Next.js 15 需要這個配置
};

// 導出 NextAuth 結果
import NextAuth from "next-auth";
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);