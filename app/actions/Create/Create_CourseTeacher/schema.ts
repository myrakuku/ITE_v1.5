

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
// app/actions/Create/Create_CourseTeacher/schema.ts
// import { z } from 'zod';

// export const CreateCourseTeacherSchema = z.object({
//   title: z.string().min(1, '標題不可為空'),
//   description: z.string().min(1, '描述不可為空'),
//   courseCode: z.string().min(1, '課程代碼不可為空'),
//   schoolName: z.string().min(1, '學校名稱不可為空'),
//   numberOfDays: z.number().min(0.1, '課程天數必須為正數'), // 從 int() 改為 number()，允許小數
//   timeHours: z.number().min(0, '課程時數必須為正數'), // 從 int() 改為 number()，允許小數
//   timeRanges: z
//     .array(
//       z.object({
//         timeRange: z.enum(['morning', 'afternoon', 'evening', 'full_day']),
//         starttime: z.string().optional().nullable(),
//         endtime: z.string().optional().nullable(),
//       })
//     )
//     .min(1, '至少需要一個時間段')
//     .optional(),
//   teacher: z.array(z.string().min(1, '教師名稱不可為空')).min(1, '至少需要一名教師'),
//   isPublic: z.boolean(),
//   isProduct: z.boolean(),
//   type: z.array(z.string().min(1, '課程類型不可為空')),
//   courseModuleId: z.string().nullable(),
//   teacherId: z.string().uuid('教師 ID 必須是有效的 UUID'),
//   startDate: z.string().optional().nullable(),
//   endDate: z.string().optional().nullable(),
//   courseDates: z.array(z.string()).optional(),
//   weekday: z.string().optional().nullable(),
//   classroom: z.string().optional().nullable(),
// });