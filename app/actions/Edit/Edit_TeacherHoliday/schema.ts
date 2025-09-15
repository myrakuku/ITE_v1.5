// import { z } from "zod";


//  export const EditTeacherHolidaySchema = z.object({
//    TeacherId: z.string(),
//     date: z.array(z.string()),
//  })

import { z } from "zod";

export const EditTeacherHolidaySchema = z.object({
  teacherId: z.string().min(1, "教師 ID 為必填項"),
  date: z
    .array(z.string())
    .min(1, "至少需要選擇一個日期")
    .refine(
      (dates) => dates.every((date) => !isNaN(Date.parse(date))),
      {
        message: "所有日期必須為有效的 YYYY-MM-DD 格式",
      }
    ),
});