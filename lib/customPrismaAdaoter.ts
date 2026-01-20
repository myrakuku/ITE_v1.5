import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { AdapterUser } from "@auth/core/adapters";
import { UserRole } from "@prisma/client"; // 導入 Prisma 的 UserRole 枚舉

// 擴展 AdapterUser 類型以包含 role 屬性
interface CustomAdapterUser extends AdapterUser {
  role?: UserRole;
}

export function CustomPrismaAdapter(p: PrismaClient) {
  const adapter = PrismaAdapter(p);

  // 自定義 createUser，處理 role 字段
  adapter.createUser = async (data) => {
    // 將 data 轉換為我們的自定義類型以訪問 role
    const customData = data as CustomAdapterUser;
    
    const user = await p.user.create({
      data: {
        id: data.id,
        name: data.name ?? "Unknown",
        role: customData.role ?? "USER", // 使用自定義類型的 role
        email: data.email ?? null,
        emailVerified: data.emailVerified ?? null,
        username: data.name ? `${data.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}` : `user-${Date.now()}`,
        password: "", // 提供預設值
      },
    });

    // 轉換為 AdapterUser 類型
    return {
      ...user,
      email: user.email ?? "",
    } as AdapterUser;
  };

  // 自定義 updateUser，處理 role 字段
  adapter.updateUser = async (data) => {
    const customData = data as CustomAdapterUser;
    
    // 準備更新數據，只包含存在的字段
    const updateData: any = {};
    
    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    
    if (data.email !== undefined) {
      updateData.email = data.email ?? null;
    }
    
    if (data.emailVerified !== undefined) {
      updateData.emailVerified = data.emailVerified ?? null;
    }
    
    // 只有在有提供 role 時才更新
    if (customData.role !== undefined) {
      updateData.role = customData.role;
    }

    const user = await p.user.update({
      where: { id: data.id },
      data: updateData,
    });

    // 轉換為 AdapterUser 類型
    return {
      ...user,
      email: user.email ?? "",
    } as AdapterUser;
  };

  // 自定義 getUser 以確保返回正確的類型
  adapter.getUser = async (id) => {
    const user = await p.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return {
      ...user,
      email: user.email ?? "",
    } as AdapterUser;
  };

  // 自定義 getUserByEmail
  adapter.getUserByEmail = async (email) => {
    const user = await p.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return {
      ...user,
      email: user.email ?? "",
    } as AdapterUser;
  };

  return adapter;
}