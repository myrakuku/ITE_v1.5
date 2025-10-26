// // app/actions/Create/Create_Product/schema.ts

// import { z } from "zod";

// export const CreateProductSchema = z.object({
//   title: z.string().min(1, { message: "標題不能為空" }),
//   description: z.string().min(1, { message: "描述不能為空" }),
//   price: z.number().min(0, { message: "價格必須大於 -1" }),
//   real_price: z.number(),
//   IsPublic: z.boolean(),
//   CourseProductTypeArray: z.array(z.string()),
//   CourseProductStatusArray: z.array(z.string()),
//   courseId: z.string().uuid("無效的課程 ID").nullable(),
//   images: z.any().optional(), // 改為 z.any()，在 Server Action 中驗證
// }).refine((data) => data.CourseProductTypeArray !== undefined, {
//   message: "CourseProductTypeArray 不能為 undefined",
//   path: ["CourseProductTypeArray"],
// }).refine((data) => data.CourseProductStatusArray !== undefined, {
//   message: "CourseProductStatusArray 不能為 undefined",
//   path: ["CourseProductStatusArray"],
// });

import { z } from "zod";

export const CreateSpecialCourseProductSchema = z.object({
  title: z.string().min(1, { message: "標題不能為空" }),
  description: z.string().min(1, { message: "描述不能為空" }),
  price: z.number().min(0, { message: "價格必須大於 -1" }),
  real_price: z.number(),
  IsPublic: z.boolean(),
  CourseProductTypeArray: z.array(z.string()),
  CourseProductStatusArray: z.array(z.string()),
  courseId: z.string().uuid("無效的課程 ID").nullable(),
  images: z.any().optional(), // 圖片檔案，伺服器端驗證
  videos: z.any().optional(), // 影片檔案，伺服器端驗證
  Target_Audience: z.string().nullable(), // 接受 string | null
  Course_Objective: z.string().nullable(), // 接受 string | null
  Applicable_Scenarios: z.string().nullable(), // 接受 string | null
}).refine((data) => data.CourseProductTypeArray !== undefined, {
  message: "CourseProductTypeArray 不能為 undefined",
  path: ["CourseProductTypeArray"],
}).refine((data) => data.CourseProductStatusArray !== undefined, {
  message: "CourseProductStatusArray 不能為 undefined",
  path: ["CourseProductStatusArray"],
});