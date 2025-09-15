// app/actions/Create/Create_user.ts
'use server'

import { db } from '@/lib/db'
import { CreateUserSchema } from './schema'
import { InputType, ReturnType } from './types'
import { UserRole } from '@prisma/client'
import { CreateSafeAction } from '@/lib/create-safe-action'
import bcrypt from 'bcryptjs'

const handler = async (data: InputType): Promise<ReturnType> => {
  const { username, password, phone, name, role } = data

  try {
    // 檢查用戶名是否已存在
    const existingUser = await db.user.findUnique({
      where: { username },
      select: { id: true },
    })

    if (existingUser) {
      return { error: '用戶名稱已存在' }
    }

    // 使用 bcrypt 加密密碼
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await db.user.create({
      data: {
        username,
        password: hashedPassword,
        phone,
        name,
        role: role as UserRole,
      },
    })

    // 只返回 schema 定義的字段，排除 password
    const user_data = {
      username: user.username,
      password: hashedPassword,
      phone: user.phone,
      name: user.name,
      role: user.role,
    }

    console.log('-- Create User -- : ', user_data, '-- End --')

    return { data: user_data }
  } catch (error) {
    console.error('Error creating user: ', error)
    return { error: '無法創建用戶，請檢查輸入數據或稍後重試' }
  }
}

export const CreateUserAction = CreateSafeAction(CreateUserSchema, handler)