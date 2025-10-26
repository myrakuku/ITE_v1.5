// // schema.ts
// import { z } from "zod";

// const TimeRangeSchema = z.object({
//   timeRange: z.string(),
//   startTime: z.string().optional().nullable(),
//   endTime: z.string().optional().nullable(),
// });

// export const CreateProductSchema = z.object({
//   title: z.string().min(1, "標題不能為空"),
//   description: z.string().min(1, "描述不能為空"),
//   price: z.number().min(0, "價格必須為非負數"),
//   real_price: z.number().min(0, "實際價格必須為非負數"),
//   IsPublic: z.boolean(),
//   CourseProductTypeArray: z.array(z.string()).optional(),
//   CourseProductStatusArray: z.array(z.string()).optional(),
//   courseId: z.string().uuid("無效的課程 ID").nullable(),
//   imageUrls: z.array(z.string().url("無效的圖片 URL")).optional(),
//   videoUrls: z.string().optional(),
//   Target_Audience: z.string().optional().nullable(),
//   Course_Objective: z.string().optional().nullable(),
//   Applicable_Scenarios: z.string().optional().nullable(),
//   courseDates: z
//     .array(
//       z.string().refine((val) => !val || !isNaN(Date.parse(val)), {
//         message: "無效的課程日期",
//       })
//     )
//     .optional(),
//   courseTimeRanges: z.array(TimeRangeSchema).optional(),
// });

// export type InputType = z.infer<typeof CreateProductSchema>;

// export const OutputProductSchema = CreateProductSchema.extend({
//   id: z.string().uuid("無效的產品 ID"),
//   createdAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
//     message: "無效的創建時間",
//   }),
//   updatedAt: z.string().refine((val) => !isNaN(Date.parse(val)), {
//     message: "無效的更新時間",
//   }),
// });

// export type OutputType = z.infer<typeof OutputProductSchema>;

// export type ReturnType = {
//   data?: OutputType;
//   error?: string;
//   fieldErrors?: Record<string, string[]>;
// };


// schema.ts
import { z } from "zod";

export const CreateProductSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  real_price: z.number().nonnegative(),
  IsPublic: z.boolean(),
  CourseProductTypeArray: z.array(z.string()).optional(),
  CourseProductStatusArray: z.array(z.string()).optional(),
  courseId: z.string().nullable().optional(),
  imageUrls: z.array(z.string()).optional(),
  videoUrls: z.string().optional(),
  Target_Audience: z.string().nullable().optional(),
  Course_Objective: z.string().nullable().optional(),
  Applicable_Scenarios: z.string().nullable().optional(),
  courseDates: z.array(z.string()).optional(),
  courseTimeRanges: z
    .array(
      z.object({
        timeRange: z.string(),
        startTime: z.string().nullable().optional(),
        endTime: z.string().nullable().optional(),
      })
    )
    .optional(),
});

// 输入类型只包含客户端提交的数据
export type InputType = z.infer<typeof CreateProductSchema>;

// 输出类型额外添加服务端生成的字段
export type OutputType = InputType & {
  id: string;
  createdAt: string;
  updatedAt: string;
};