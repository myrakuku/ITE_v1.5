// app/actions/Create/Create_user/schema.ts
import { z } from 'zod'
import { UserRole } from '@prisma/client'

export const CreateUserSchema = z.object({
  username: z.string().min(3, '用戶名稱至少需要 3 個字符'),
  password: z.string().min(0, '密碼至少需要 0 個字符'),
  phone: z.string().nullable(),
  name: z.string().nullable(),
  role: z.nativeEnum(UserRole), // 確保 role 為必填
})