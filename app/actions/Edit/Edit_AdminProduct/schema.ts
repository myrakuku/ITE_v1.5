// import { z } from "zod";

// export const EditProductSchema = z.object({
//   productId: z.string().uuid({ message: "無效的產品 ID" }),
//   title: z.string().min(1, { message: "標題不能為空" }),
//   description: z.string().min(1, { message: "描述不能為空" }),
//   price: z.number().min(0, { message: "價格必須大於等於 0" }),
//   real_price: z.number().min(0, { message: "實際價格必須大於等於 0" }),
//   IsPublic: z.boolean(),
//   CoursePorductTypeArray: z.array(z.string()),
//   CoursePorductStatueArray: z.array(z.string()),
//   // 改為 unknown，Server Action 內部自行驗證
//   images: z.array(z.any()).optional(),
//   video_urls: z.array(z.string().url({ message: "無效的影片 URL" })).optional(),
// })
// .refine((data) => Array.isArray(data.CoursePorductTypeArray), {
//   message: "CoursePorductTypeArray 必須是陣列",
//   path: ["CoursePorductTypeArray"],
// })
// .refine((data) => Array.isArray(data.CoursePorductStatueArray), {
//   message: "CoursePorductStatueArray 必須是陣列",
//   path: ["CoursePorductStatueArray"],
// });

// // app/actions/Edit/Edit_AdminProduct/schema.ts
import { z } from "zod";

// 自訂 File[] 驗證（避免 any）
const fileArraySchema = z.custom<File[]>((val) => {
  return Array.isArray(val) && val.every((item) => item instanceof File);
}, "必須是 File 陣列");

export const EditProductSchema = z.object({
  productId: z.string().uuid({ message: "無效的產品 ID" }),
  title: z.string().min(1, { message: "標題不能為空" }),
  description: z.string().min(1, { message: "描述不能為空" }),
  price: z.number().min(0, { message: "價格必須大於等於 0" }),
  real_price: z.number().min(0, { message: "實際價格必須大於等於 0" }),
  IsPublic: z.boolean(),
  CoursePorductTypeArray: z.array(z.string()),
  CoursePorductStatueArray: z.array(z.string()),
  images: fileArraySchema.optional(), // 不再使用 any
  video_urls: z.array(z.string().url({ message: "無效的影片 URL" })).optional(),
})
.refine((data) => Array.isArray(data.CoursePorductTypeArray), {
  message: "CoursePorductTypeArray 必須是陣列",
  path: ["CoursePorductTypeArray"],
})
.refine((data) => Array.isArray(data.CoursePorductStatueArray), {
  message: "CoursePorductStatueArray 必須是陣列",
  path: ["CoursePorductStatueArray"],
});