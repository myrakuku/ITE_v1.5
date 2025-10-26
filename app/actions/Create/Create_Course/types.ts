// types.ts
import { z } from "zod";
import { CreateCourseSchema } from "./schema";

// 使用 Action Schema 的類型推斷
export type InputType = z.infer<typeof CreateCourseSchema>;

export type CourseReturnType = {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  numberOfDays: number;
  timeHours: number;
  timeRange: {
    id: string;
    timeRange: "morning" | "afternoon" | "evening" | "full_day";
    starttime: string | null;
    endtime: string | null;
    createdAt: Date;
    updatedAt: Date;
  }[];
  teacher: string[];
  teacherId: string;
  isPublic: boolean;
  isProduct: boolean;
  type: string[];
  courseModulId: string | null;
  startDate: string | null;
  endDate: string | null;
  Coursedates: string[];
  weekday: string | null;
  classroom: string | null;
  createdAt: Date;
  updatedAt: Date;
  Producted: boolean;
  numberOfStudents: number | null;
  Students: string[];
};

export type ReturnType = {
  data?: CourseReturnType;
  error?: string;
};
// // app/actions/Create/Create_Course/types.ts
// import { z } from "zod";
// import { CreateCourseSchema } from "./schema";

// export type InputType = z.infer<typeof CreateCourseSchema>;

// export type CourseReturnType = {
//   id: string;
//   title: string;
//   description: string;
//   courseCode: string;
//   schoolName: string;
//   numberOfDays: number;
//   timeHours: number;
//   timeRange: { // 改為 timeRange，與 schema 一致
//     id: string;
//     timeRange: "morning" | "afternoon" | "evening" | "full_day";
//     starttime: string | null;
//     endtime: string | null;
//     createdAt: Date;
//     updatedAt: Date;
//   }[];
//   teacher: string[];
//   teacherId: string;
//   isPublic: boolean;
//   isProduct: boolean;
//   type: string[];
//   courseModulId: string | null;
//   startDate: string | null;
//   endDate: string | null;
//   Coursedates: string[];
//   weekday: string | null;
//   classroom: string | null;
//   createdAt: Date;
//   updatedAt: Date;
//   Producted: boolean;
// };

// export type ReturnType = {
//   data?: CourseReturnType;
//   error?: string;
// };