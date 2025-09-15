// import { z } from "zod"; 
// import { ActionState } from "@/lib/create-safe-action";
// import { CreateTeacherHolidaySchema } from "./schema";
// import { teacherholiday } from "@prisma/client";




// export type InputType = z.infer<typeof CreateTeacherHolidaySchema>;
// export type ReturnType = ActionState<InputType , teacherholiday>



import { z } from "zod";
import { CreateTeacherHolidaySchema } from "./schema";

export type InputType = z.infer<typeof CreateTeacherHolidaySchema>;

// 定義返回數據的結構，與 InputType 一致
export type TeacherHolidayData = {
  TeacherId: string;
  date: string[];
};

export type ReturnType = {
  data?: TeacherHolidayData;
  error?: string;
};