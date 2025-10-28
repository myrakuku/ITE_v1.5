// src/auth.ts
import NextAuth from "next-auth";
import { authOptions } from "./auth-options";

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);


// import { AuthConfig } from "@auth/core/types";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import CredentialsProvider from "@auth/core/providers/credentials";
// import GoogleProvider from "@auth/core/providers/google";
// import bcrypt from "bcryptjs";
// import { db } from "./lib/db";
// import { z } from "zod";
// import { randomUUID } from "crypto";

// export enum UserRole {
//   USER = "USER",
//   ADMIN = "ADMIN",
//   TEACHER = "TEACHER",
// }

// const credentialsSchema = z.object({
//   username: z.string().min(1, "用戶名不能為空"),
//   password: z.string().min(1, "密碼不能為空"),
// });

// export const authOptions: AuthConfig = {
//   adapter: PrismaAdapter(db),
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60,
//     updateAge: 24 * 60 * 60,
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

//           console.log("憑證驗證成功:", { userId: user.id, username });

//           return {
//             id: user.id,
//             name: user.name,
//             email: user.email,
//             role: user.role as UserRole,
//           };
//         } catch (error) {
//           console.error("Authentication error:", error);
//           return null;
//         }
//       },
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user, account, profile }) {
//       if (user) {
//         token.id = user.id;
//         token.name = user.name;
//         token.email = user.email;
//         token.role = user.role || UserRole.USER;
//       }
//       if (account && account.provider === "google" && profile?.email) {
//         console.log("Google 登入回調:", { profile });
//         const existingOAuth = await db.oAuth.findUnique({
//           where: { OAuthEmail: profile.email },
//           include: { User: true },
//         });
//         if (!existingOAuth) {
//           const newUser = await db.user.create({
//             data: {
//               email: profile.email,
//               name: profile.name || "",
//               username: profile.email.split("@")[0] || `google_${randomUUID()}`,
//               role: UserRole.USER,
//               emailVerified: new Date(),
//               OAuth: {
//                 create: { OAuthEmail: profile.email },
//               },
//             },
//           });
//           console.log("創建新用戶:", { userId: newUser.id, role: newUser.role });
//           token.id = newUser.id;
//           token.role = newUser.role;
//           token.email = newUser.email;
//           token.name = newUser.name;
//         } else {
//           token.id = existingOAuth.User.id;
//           token.role = existingOAuth.User.role;
//           token.email = existingOAuth.User.email;
//           token.name = existingOAuth.User.name;
//         }
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       console.log("Session callback:", { session, token });
//       if (token && session.user) {
//         session.user.id = token.id as string;
//         session.user.name = token.name as string;
//         session.user.email = token.email as string;
//         session.user.role = token.role as UserRole;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/login",
//     error: "/login",
//   },
//   trustHost: true,
// };

// import NextAuth from "next-auth";
// export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);