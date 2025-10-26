// app/actions/Create/Create_user/types.ts
import { z } from 'zod'
import { CreateUserSchema } from './schema'
import { ActionState } from '@/lib/create-safe-action'

export type InputType = z.infer<typeof CreateUserSchema>
export type ReturnType = ActionState< z.infer<typeof CreateUserSchema>>