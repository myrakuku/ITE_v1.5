// import { z } from "zod";

// export const CreateCourseTeacherSchema = z.object({
//   title: z.string().min(1, "標題不可為空"),
//   description: z.string().min(1, "描述不可為空"),
//   course_code: z.string().min(1, "課程代碼不可為空"),
//   school_name: z.string().min(1, "學校名稱不可為空"),
//   Number_of_days: z.number().int().min(1, "課程天數必須為正整數"),
//   TimeRange: z.array(
//     z.object({
//       timeRange: z.enum(["morning", "afternoon", "evening", "full_day"]),
//       start_time: z.string().optional().nullable(),
//       end_time: z.string().optional().nullable(),
//     })
//   ).optional(),
//   time_hours: z.number().int().min(0, "課程時數必須為正整數"),
//   teacher: z.array(z.string().min(1, "教師名稱不可為空")).min(1, "至少需要一名教師"),
//   Ispublic: z.boolean(),
//   Isproduct: z.boolean(),
//   type: z.array(z.string().min(1, "課程類型不可為空")),
//   courseModulId: z.string().nullable(),
//   teacher_id: z.string().uuid("教師 ID 必須是有效的 UUID"),
//   start_date: z.string().optional().nullable(),
//   end_date: z.string().optional().nullable(),
//   start_time: z.string().optional().nullable(),
//   end_time: z.string().optional().nullable(),
//   Coursedates: z.array(z.string()).optional(),
//   weekday: z.string().optional().nullable(), // 新增週份欄位
//   classroom: z.string().optional().nullable(), // 新增課室欄位
// });


// import { z } from "zod";

// export const CreateCourseTeacherSchema = z.object({
//   title: z.string().min(1, "標題不可為空"),
//   description: z.string().min(1, "描述不可為空"),
//   course_code: z.string().min(1, "課程代碼不可為空"),
//   school_name: z.string().min(1, "學校名稱不可為空"),
//   Number_of_days: z.number().int().min(1, "課程天數必須為正整數"),
//   TimeRange: z.array(z.enum(["morning", "afternoon", "evening", "full_day"])).optional(), // 修改為 TimeRange，字串陣列
//   time_hours: z.number().int().min(0, "課程時數必須為正整數"),
//   teacher: z.array(z.string().min(1, "教師名稱不可為空")).min(1, "至少需要一名教師"),
//   Ispublic: z.boolean(),
//   Isproduct: z.boolean(),
//   type: z.array(z.string().min(1, "課程類型不可為空")),
//   courseModulId: z.string().nullable(),
//   teacher_id: z.string().uuid("教師 ID 必須是有效的 UUID"),
//   start_date: z.string().optional().nullable(),
//   end_date: z.string().optional().nullable(),
//   start_time: z.string().optional().nullable(),
//   end_time: z.string().optional().nullable(),
//   Coursedates: z.array(z.string()).optional(),
//   weekday: z.string().optional().nullable(),
//   classroom: z.string().optional().nullable(),
// });



// import { z } from "zod";

// export const CreateCourseTeacherSchema = z.object({
//   title: z.string().min(1, "課程標題為必填項"),
//   description: z.string().min(1, "課程描述為必填項"),
//   courseCode: z.string().min(1, "課程代碼為必填項"),
//   schoolName: z.string().min(1, "學校名稱為必填項"),
//   numberOfDays: z.number().min(1, "課程天數必須大於 0"),
//   courseModuleId: z.string().nullable(),
//   timeHours: z.number().min(0, "課程時數不能為負數"),
//   teacher: z.array(z.string()).min(1, "至少需要一名教師"),
//   isPublic: z.boolean(),
//   isProduct: z.boolean(),
//   timeRange: z.array(z.enum(["morning", "afternoon", "evening", "full_day"])).min(1, "至少選擇一個時段"),
//   type: z.array(z.string()).min(1, "至少選擇一個課程類型"),
//   teacherId: z.string().min(1, "教師 ID 為必填項"),
//   startDate: z.string().nullable(),
//   endDate: z.string().nullable(),
//   starttime: z.string().nullable(),
//   endtime: z.string().nullable(),
//   Coursedates: z.array(z.string()).optional(),
//   weekday: z.string().optional().nullable(),
//   classroom: z.string().optional().nullable(),
// });

// app/actions/Create/Create_CourseTeacher/schema.ts
// app/actions/Create/Create_CourseTeacher/schema.ts
import { z } from 'zod';

export const CreateCourseTeacherSchema = z.object({
  title: z.string().min(1, '標題不可為空'),
  description: z.string().min(1, '描述不可為空'),
  courseCode: z.string().min(1, '課程代碼不可為空'),
  schoolName: z.string().min(1, '學校名稱不可為空'),
  numberOfDays: z.number().min(0.1, '課程天數必須為正數'), // 從 int() 改為 number()，允許小數
  timeHours: z.number().min(0, '課程時數必須為正數'), // 從 int() 改為 number()，允許小數
  timeRanges: z
    .array(
      z.object({
        timeRange: z.enum(['morning', 'afternoon', 'evening', 'full_day']),
        starttime: z.string().optional().nullable(),
        endtime: z.string().optional().nullable(),
      })
    )
    .min(1, '至少需要一個時間段')
    .optional(),
  teacher: z.array(z.string().min(1, '教師名稱不可為空')).min(1, '至少需要一名教師'),
  isPublic: z.boolean(),
  isProduct: z.boolean(),
  type: z.array(z.string().min(1, '課程類型不可為空')),
  courseModuleId: z.string().nullable(),
  teacherId: z.string().uuid('教師 ID 必須是有效的 UUID'),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  courseDates: z.array(z.string()).optional(),
  weekday: z.string().optional().nullable(),
  classroom: z.string().optional().nullable(),
});