// schema.ts
import { z } from "zod";

// 基礎字段定義
const TimeRangeItemSchema = z.object({
  timeRange: z.enum(["morning", "afternoon", "evening", "full_day"]),
  starttime: z.string().nullable(),
  endtime: z.string().nullable(),
});

// 單一的 Schema，用於表單和 Action
export const CreateCourseSchema = z.object({
  title: z.string().min(1, { message: "標題不能為空" }),
  description: z.string().min(1, { message: "描述不能為空" }),
  courseCode: z.string().min(1, { message: "課程代碼不能為空" }),
  schoolName: z.string().min(1, { message: "學校名稱不能為空" }),
  numberOfDays: z.number().min(1, { message: "課程天數必須大於 0" }),
  timeHours: z.number().min(1, { message: "課程小時數必須大於 0" }),
  timeRange: z.array(TimeRangeItemSchema).min(1, { message: "至少需要一個時間段" }),
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
  Producted: z.boolean(), // 移除 .default(false)
  numberOfStudents: z.number().int().nonnegative().nullable(),
  Students: z.array(z.string()),
});

// 明確導出輸入和輸出類型
export type CreateCourseInput = z.input<typeof CreateCourseSchema>;
export type CreateCourseOutput = z.output<typeof CreateCourseSchema>;