import { z } from "zod";

export const Invoice_Create_Schema = z.object({
  title: z.string().min(1, "標題為必填"),
  content: z.array(z.string()).min(1, "至少選擇一個產品"),
  studentname: z.string().min(1, "學生名稱為必填"),
  student_id: z.string().min(1, "學生ID為必填"),
  price: z.coerce.number().min(0, "價格不能為負數"),
  PaymentMethods: z.array(z.string()).optional(),
  Invoice_id: z.string(),
  servetype: z.string(),
  DB: z.coerce.number().min(0, "價格不能為負數"),
  adminFee: z.coerce.number().min(0, "價格不能為負數"),
});