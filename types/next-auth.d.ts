// // types/next-auth.d.ts
// import { DefaultSession, DefaultUser } from 'next-auth';
// import { JWT } from 'next-auth/jwt';

// declare module 'next-auth' {
//   interface Session {
//     user: {
//       id: string;
//       name?: string | null;
//       role?: string; // 對應 Prisma 的 UserRole 枚舉
//     } & DefaultSession['user'];
//   }

//   interface User extends DefaultUser {
//     role?: string; // 對應 Prisma 的 UserRole 枚舉
//   }
// }

// declare module 'next-auth/jwt' {
//   interface JWT {
//     id?: string;
//     name?: string | null;
//     role?: string; // 對應 Prisma 的 UserRole 枚舉
//   }
// }



// types/next-auth.d.ts
import { UserRole } from "@/lib/auth";
import { DefaultSession, DefaultUser } from "@auth/core/types";

declare module "@auth/core/types" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    name: string | null;
    role: UserRole;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}