import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { AdapterUser } from "@auth/core/adapters";

export function CustomPrismaAdapter(p: PrismaClient) {
  const adapter = PrismaAdapter(p);

  // 自定義 createUser，確保 email 為 string
  adapter.createUser = async (data) => {
    const user = await p.user.create({
      data: {
        id: data.id,
        name: data.name ?? "Unknown",
        role: data.role ?? "USER", // 提供預設角色
        email: data.email ?? null, // Prisma schema 允許 null
        emailVerified: data.emailVerified ?? null,
        username: data.name ?? "default-username",
        password: "", // 假設有預設密碼邏輯
      },
    });

    // 轉換為 AdapterUser 型別，確保 email 為 string
    return {
      ...user,
      email: user.email ?? "", // 使用空字串作為預設值
    } as AdapterUser;
  };

  // 自定義 updateUser，確保 email 為 string
  adapter.updateUser = async (data) => {
    const user = await p.user.update({
      where: { id: data.id },
      data: {
        name: data.name,
        email: data.email ?? null,
        emailVerified: data.emailVerified ?? null,
        role: data.role,
      },
    });

    // 轉換為 AdapterUser 型別，確保 email 為 string
    return {
      ...user,
      email: user.email ?? "", // 使用空字串作為預設值
    } as AdapterUser;
  };

  return adapter;
}