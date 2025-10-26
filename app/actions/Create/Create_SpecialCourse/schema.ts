// // app/actions/Create/Create_SpecialCourse/schema.ts
// import { z } from "zod";

// export const CreateSpecialCourseSchema = z.object({
//   title: z.string().min(1, { message: "標題不能為空" }),
//   description: z.string().min(1, { message: "描述不能為空" }),
//   courseCode: z.string().min(1, { message: "課程代碼不能為空" }),
//   schoolName: z.string().min(1, { message: "學校名稱不能為空" }),
//   numberOfDays: z.number().min(1, { message: "課程天數必須大於 0" }),
//   numberOfStudents:z.number().min(1, { message: "課程天數必須大於 0" }),
//   timeHours: z.number().min(1, { message: "課程小時數必須大於 0" }),
//   timeRange: z.array(
//     z.object({
//       timeRange: z.enum(["morning", "afternoon", "evening", "full_day"]),
//       starttime: z.string().nullable(),
//       endtime: z.string().nullable(),
//     })
//   ).default([]),
//   teacher: z.array(z.string()).min(1, { message: "至少需要一名教師" }),
//   teacherId: z.string().uuid("無效的教師 ID"),
//   isPublic: z.boolean(),
//   isProduct: z.boolean(),
//   type: z.array(z.string()).default([]),
//   courseModulId: z.string().uuid("無效的課程模組 ID").nullable(),
//   startDate: z.string().nullable(),
//   endDate: z.string().nullable(),
//   Coursedates: z.array(z.string()).default([]),
//   weekday: z.string().nullable(),
//   classroom: z.string().nullable(),
//   Producted: z.boolean().default(false), // Add Producted field with default false
// });

// app/actions/Create/Create_SpecialCourse/schema.ts
import { z } from "zod";

export const CreateSpecialCourseSchema = z.object({
  title: z.string().min(1, { message: "標題不能為空" }),
  description: z.string().min(1, { message: "描述不能為空" }),
  courseCode: z.string().min(1, { message: "課程代碼不能為空" }),
  schoolName: z.string().min(1, { message: "學校名稱不能為空" }),
  numberOfDays: z.number().min(1, { message: "課程天數必須大於 0" }),
  numberOfStudents: z.number().min(1, { message: "學生人數必須大於 0" }).nullable(), // 修改：允許 null
  maxStudents: z.number().int().min(1, { message: "人數上限必須為正整數" }).nullable().optional(), // 新增：可選且允許 null
  timeHours: z.number().min(1, { message: "課程小時數必須大於 0" }),
  timeRange: z.array(
    z.object({
      timeRange: z.enum(["morning", "afternoon", "evening", "full_day"]),
      starttime: z.string().nullable(),
      endtime: z.string().nullable(),
    })
  ),
  teacher: z.array(z.string()).min(1, { message: "至少需要一名教師" }),
  teacherId: z.string().uuid("無效的教師 ID"),
  isPublic: z.boolean(),
  isProduct: z.boolean(),
  type: z.array(z.string()),
  courseModulId: z.string().uuid("無效的課程模組 ID").nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
  Coursedates: z.array(z.string()),
  weekday: z.string().nullable(),
  classroom: z.string().nullable(),
  Producted: z.boolean(),
});