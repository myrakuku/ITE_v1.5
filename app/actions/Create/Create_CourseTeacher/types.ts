// import { z } from "zod";
// import { CreateCourseTeacherSchema } from "./schema";

// export type InputType = z.infer<typeof CreateCourseTeacherSchema>;

// export type CourseReturnType = z.infer<typeof CreateCourseTeacherSchema> & {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   Coursedates: string[];
//   classroom: string | null; // 新增課室欄位
// };

// export type ReturnType = {
//   data?: CourseReturnType;
//   error?: string;
// };


// import { z } from "zod";
// import { CreateCourseTeacherSchema } from "./schema";

// export type InputType = z.infer<typeof CreateCourseTeacherSchema>;

// export type CourseReturnType = {
//   id: string;
//   title: string;
//   description: string;
//   courseCode: string;
//   schoolName: string;
//   numberOfDays: number;
//   courseModuleId: string | null;
//   timeHours: number;
//   teacher: string[];
//   isPublic: boolean;
//   isProduct: boolean;
//   timeRange: ("morning" | "afternoon" | "evening" | "full_day")[];
//   type: string[];
//   teacherId: string;
//   startDate: string | null;
//   endDate: string | null;
//   courseDates: string[];
//   classroom: string | null;
//   weekday: string | null;
//   createdAt: Date;
//   updatedAt: Date;
//   CourseTimeRanges: {
//     id: string;
//     timeRange: string;
//     starttime: string | null;
//     endtime: string | null;
//   }[];
// };

// export type ReturnType = {
//   data?: CourseReturnType;
//   error?: string;
// };



import { z } from 'zod';
import { CreateCourseTeacherSchema } from './schema';

export type InputType = z.infer<typeof CreateCourseTeacherSchema>;

export type CourseTimeRangeReturnType = {
  id: string;
  timeRange: 'morning' | 'afternoon' | 'evening' | 'full_day';
  starttime: string | null;
  endtime: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// app/actions/Create/Create_CourseTeacher/types.ts
export type CourseReturnType = {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  numberOfDays: number; // 保持 number，因為 TypeScript 不區分 Int 和 Float
  timeHours: number; // 保持 number，因為 TypeScript 不區分 Int 和 Float
  timeRanges: CourseTimeRangeReturnType[];
  teacher: string[];
  teacherId: string;
  isPublic: boolean;
  isProduct: boolean;
  type: string[];
  courseModuleId: string | null;
  startDate: string | null;
  endDate: string | null;
  courseDates: string[];
  classroom: string | null;
  weekday: string | null;
  createdAt: Date;
  updatedAt: Date;
  Producted: boolean;
};

export type ReturnType = {
  data?: CourseReturnType;
  error?: string;
};