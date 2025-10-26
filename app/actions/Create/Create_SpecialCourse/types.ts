// app/actions/Create/Create_SpecialCourse/types.ts
import { z } from "zod";
import { CreateSpecialCourseSchema } from "./schema";

export type InputType = z.infer<typeof CreateSpecialCourseSchema>;

export type CourseReturnType = {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  numberOfDays: number;
  numberOfStudents: number | null; // 修改：允許 null
  maxStudents: number | null; // 新增：人數上限
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
  Students: string[]; // 新增：學生列表
};

export type ReturnType = {
  data?: CourseReturnType;
  error?: string;
};