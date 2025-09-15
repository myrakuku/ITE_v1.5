// import { z } from "zod";

// export const CreateCourseSchema = z.object({
//   title: z.string().min(1, "標題不可為空"),
//   description: z.string().min(1, "描述不可為空"),
//   courseCode: z.string().min(1, "課程代碼不可為空"),
//   schoolName: z.string().min(1, "學校名稱不可為空"),
//   numberOfDays: z.number().int().min(1, "課程天數必須為正整數"),
//   timeRange: z.array(
//     z.object({
//       timeRange: z.enum(["morning", "afternoon", "evening", "full_day"]),
//       starttime: z.string().optional().nullable(),
//       endtime: z.string().optional().nullable(),
//     })
//   ).optional(),
//   timeHours: z.number().int().min(0, "課程時數必須為正整數"),
//   teacher: z.array(z.string().min(1, "教師名稱不可為空")).min(1, "至少需要一名教師"),
//   isPublic: z.boolean(),
//   isProduct: z.boolean(),
//   type: z.array(z.string().min(1, "課程類型不可為空")),
//   courseModulId: z.string().nullable(),
//   teacherId: z.string().uuid("教師 ID 必須是有效的 UUID"),
//   startDate: z.string().optional().nullable(),
//   endDate: z.string().optional().nullable(),
//   starttime: z.string().optional().nullable(),
//   endtime: z.string().optional().nullable(),
//   Coursedates: z.array(z.string()).optional(),
//   weekday: z.string().optional().nullable(), // 新增週份欄位
//   classroom: z.string().optional().nullable(), // 新增課室欄位
// });

// app/actions/Create/Create_Course/schema.ts
import { z } from "zod";

export const CreateCourseSchema = z.object({
  title: z.string().min(1, { message: "標題不能為空" }),
  description: z.string().min(1, { message: "描述不能為空" }),
  courseCode: z.string().min(1, { message: "課程代碼不能為空" }),
  schoolName: z.string().min(1, { message: "學校名稱不能為空" }),
  numberOfDays: z.number().min(1, { message: "課程天數必須大於 0" }),
  timeHours: z.number().min(1, { message: "課程小時數必須大於 0" }),
  timeRange: z.array(
    z.object({
      timeRange: z.enum(["morning", "afternoon", "evening", "full_day"]),
      starttime: z.string().nullable(),
      endtime: z.string().nullable(),
    })
  ).default([]),
  teacher: z.array(z.string()).min(1, { message: "至少需要一名教師" }),
  teacherId: z.string().uuid("無效的教師 ID"),
  isPublic: z.boolean(),
  isProduct: z.boolean(),
  type: z.array(z.string()).default([]),
  courseModulId: z.string().uuid("無效的課程模組 ID").nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  Coursedates: z.array(z.string()).default([]),
  weekday: z.string().nullable(),
  classroom: z.string().nullable(),
  Producted: z.boolean().default(false), // Add Producted field with default false
});