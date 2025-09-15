// import { z } from "zod";
// import { EditTeacherHolidaySchema } from "./schema";

// export type InputType = z.infer<typeof EditTeacherHolidaySchema>;

// // 定義返回數據的結構，與 InputType 一致
// export type TeacherHolidayData = {
//   TeacherId: string;
//   date: string[];
// };

// export type ReturnType = {
//   data?: TeacherHolidayData;
//   error?: string;
// };



import { z } from "zod";
import { EditTeacherHolidaySchema } from "./schema";

export type InputType = z.infer<typeof EditTeacherHolidaySchema>;

export type ReturnType = {
  data?: {
    teacherId: string;
    date: string[];
  };
  error?: string;
};