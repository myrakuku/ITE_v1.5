import { AuthConfig, DefaultSession, DefaultUser } from "@auth/core/types";
import { JWT } from "@auth/core/jwt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "@auth/core/providers/credentials";
import GoogleProvider from "@auth/core/providers/google"; // 新增 Google 提供者
import bcrypt from "bcryptjs";
import { db } from "./lib/db";
import { z } from "zod";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  TEACHER = "TEACHER",
}

const credentialsSchema = z.object({
  username: z.string().min(1, "用戶名不能為空"),
  password: z.string().min(1, "密碼不能為空"),
});

export const authOptions: AuthConfig = {
  adapter: PrismaAdapter(db) as any,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
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
            email: user.email,
            role: user.role as UserRole,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email; // 添加 email
        token.role = (user as any).role || UserRole.USER; // 默認角色為 USER
      }
      if (account && account.provider === "google" && profile?.email) {
        // 為 Google 登入用戶查找或創建用戶記錄
const existingOAuth = await db.oAuth.findUnique({
          where: { OAuthEmail: profile.email },
          include: { User: true }, // 包含關聯的 User 記錄
        });
if (!existingOAuth) {
          // 如果 OAuth 記錄不存在，創建新用戶和 OAuth 記錄
          const newUser = await db.user.create({
            data: {
              email: profile.email,
              name: profile.name || "",
              username: profile.email.split("@")[0] || `google_${crypto.randomUUID()}`,
              role: UserRole.USER,
              emailVerified: new Date(),
              OAuth: {
                create: {
                  OAuthEmail: profile.email,
                },
              },
            },
          });
          token.id = newUser.id;
          token.role = newUser.role;
        } else {
          // 如果 OAuth 記錄存在，使用關聯的 User 數據
          token.id = existingOAuth.User.id;
          token.role = existingOAuth.User.role;
          token.email = existingOAuth.User.email;
          token.name = existingOAuth.User.name;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  trustHost: true,
};


// 導出 NextAuth 結果
import NextAuth from "next-auth";
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);



// // 導出 NextAuth 結果
// import NextAuth from "next-auth";
// export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

// // auth.ts
// import { AuthConfig, DefaultSession, DefaultUser } from "@auth/core/types";
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

// // 定義憑證驗證的 schema
// const credentialsSchema = z.object({
//   username: z.string().min(1, "用戶名不能為空"),
//   password: z.string().min(1, "密碼不能為空"),
// });

// // 導出 authOptions 作為 AuthConfig
// export const authOptions: AuthConfig = {
//   adapter: PrismaAdapter(db) as any,
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
//         try {
//           const parsedCredentials = credentialsSchema.safeParse(credentials);
//           if (!parsedCredentials.success) {
//             throw new Error("無效的輸入資料");
//           }

//           const { username, password } = parsedCredentials.data;

//           const user = await db.user.findUnique({
//             where: { username },
//           });

//           if (!user || !user.password) {
//             throw new Error("用戶不存在或密碼無效");
//           }

//           const passwordsMatch = await bcrypt.compare(password, user.password);
//           if (!passwordsMatch) {
//             throw new Error("密碼錯誤");
//           }

//           return {
//             id: user.id,
//             name: user.name,
//             email: user.email, // 保持 email 字段
//             role: user.role as UserRole,
//           };
//         } catch (error) {
//           console.error("Authentication error:", error);
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user, account, profile }) {
//       // 用戶首次登入時，將用戶信息添加到 token
//       if (user) {
//         token.id = user.id;
//         token.name = user.name;
//         token.role = (user as any).role;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token && session.user) {
//         session.user.id = token.id as string;
//         session.user.name = token.name as string;
//         session.user.role = token.role as UserRole;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/login",
//     error: "/login", // 添加錯誤頁面
//   },
//   trustHost: true, // Next.js 15 需要這個配置
// };

// // 導出 NextAuth 結果
// import NextAuth from "next-auth";
// export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);