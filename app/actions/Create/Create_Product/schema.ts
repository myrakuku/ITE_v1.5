// import { z } from "zod";

// export const CreateProductSchema = z.object({
//   title: z.string().min(1, { message: "標題不能為空" }),
//   description: z.string().min(1, { message: "描述不能為空" }),
//   price: z.number().min(1, { message: "價格不能為空" }),
//   IsPublic: z.boolean(),
//   CoursePorductTypeArray: z.array(z.string()),
//   CoursePorductStatueArray: z.array(z.string()),
// });

import { z } from "zod";

export const CreateProductSchema = z.object({
  title: z.string().min(1, { message: "標題不能為空" }),
  description: z.string().min(1, { message: "描述不能為空" }),
  price: z.number().min(0, { message: "價格必須大於 -1" }),
  real_price: z.number(),
  IsPublic: z.boolean(),
  CourseProductTypeArray: z.array(z.string()),
  CourseProductStatusArray: z.array(z.string()),
  courseId: z.string().uuid("無效的課程 ID").nullable(),
}).refine((data) => data.CourseProductTypeArray !== undefined, {
  message: "CourseProductTypeArray 不能為 undefined",
  path: ["CourseProductTypeArray"],
}).refine((data) => data.CourseProductStatusArray !== undefined, {
  message: "CourseProductStatusArray 不能為 undefined",
  path: ["CourseProductStatusArray"],
});