import type { AuthConfig } from "@auth/core/types";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "@auth/core/providers/credentials";
import GoogleProvider from "@auth/core/providers/google";
import bcrypt from "bcryptjs";
import { db } from "./lib/db";
import { z } from "zod";
import { randomUUID } from "crypto";

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
  adapter: PrismaAdapter(db), // 不要覆蓋 createUser
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
          const parsed = credentialsSchema.safeParse(credentials);
          if (!parsed.success) throw new Error("無效的輸入資料");

          const { username, password } = parsed.data;
          const user = await db.user.findUnique({ where: { username } });

          if (!user || !user.password) throw new Error("用戶不存在或密碼無效");
          const match = await bcrypt.compare(password, user.password);
          if (!match) throw new Error("密碼錯誤");

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as UserRole,
          };
        } catch (error) {
          console.error("Credentials authorize error:", error);
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
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        // 讓 Prisma Adapter 創建 User
        return true;
      }
      return true;
    },

    async jwt({ token, user, account, profile }) {
      // 首次登入（user 存在）
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = (user as any).role || UserRole.USER;
      }

      // Google OAuth 後，補上 username 和 OAuth 關聯
      if (account?.provider === "google" && profile?.email && !user) {
        try {
          const dbUser = await db.user.findUnique({
            where: { email: profile.email },
          });

          if (dbUser) {
            // 補 username（如果為空）
            if (!dbUser.username) {
              const base = profile.email.split("@")[0] || "user";
              const cleanBase = base.replace(/[^a-zA-Z0-9_]/g, "_");
              let username = cleanBase;
              let counter = 1;
              while (await db.user.findUnique({ where: { username } })) {
                username = `${cleanBase}_${counter}`;
                counter++;
              }

              await db.user.update({
                where: { id: dbUser.id },
                data: { username },
              });
            }

            // 創建 OAuth 關聯
            await db.oAuth.upsert({
              where: { OAuthEmail: profile.email },
              create: {
                OAuthEmail: profile.email,
                userId: dbUser.id,
              },
              update: {},
            });

            token.id = dbUser.id;
            token.role = dbUser.role as UserRole;
            token.email = dbUser.email;
            token.name = dbUser.name;
          }
        } catch (error) {
          console.error("JWT Google 處理錯誤:", error);
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