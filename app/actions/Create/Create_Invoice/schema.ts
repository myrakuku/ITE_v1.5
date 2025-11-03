// schema.ts
import { z } from 'zod';

export const Invoice_Create_Schema = z.object({
  title: z.string(),
  content: z.array(z.string()),
  studentname: z.string(),
  student_id: z.string(),
  price: z.number(),
  servetype: z.string(),
  PaymentMethods: z.array(z.string()).optional(),
  Invoice_id: z.string(),
  DB: z.number(),
  adminFee: z.number(),
  total: z.number(),
  date: z.date(), // 改为非可选、无默认值，保证输出始终为 Date
});