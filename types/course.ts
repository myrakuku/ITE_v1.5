// types/course.ts
export interface Course {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  startDate: string | null;
  endDate: string | null;
  weekday: string | null;
  classroom: string | null;
  numberOfDays: number;
  numberOfStudents: number | null;
  maxStudents: number | null; // 新增
  timeHours: number;
  isPublic: boolean;
  isProduct: boolean;
  Producted: boolean;
  courseDates: string[];
  courseTimeRanges: {
    id: string;
    timeRange: string;
    starttime: string | null;
    endtime: string | null;
  }[];
  type: string[];
  teacher: string[];
  teacherId: string;
  courseModulId: string | null;
  createdAt: Date;
  updatedAt: Date;
  Students: string[];
}

// 創建一個用於 API 響應的寬鬆類型
export interface ApiCourse {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  startDate: string | null;
  endDate: string | null;
  weekday: string | null;
  classroom: string | null;
  numberOfDays: number;
  numberOfStudents?: number | null;
  timeHours: number;
  isPublic: boolean;
  isProduct: boolean;
  Producted?: boolean;
  courseDates?: string[];
  courseTimeRanges?: {
    id: string;
    timeRange: string;
    starttime: string | null;
    endtime: string | null;
  }[];
  type?: string[];
  teacher?: string[];
  teacherId: string;
  courseModulId?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  Students?: string[];
}
// // types/course.ts
// export interface Course {
//   id: string;
//   title: string;
//   description: string;
//   courseCode: string;
//   schoolName: string;
//   startDate: string | null;
//   endDate: string | null;
//   weekday: string | null;
//   classroom: string | null;
//   numberOfDays: number;
//   numberOfStudents?: number | null;
//   timeHours: number;
//   isPublic: boolean;
//   isProduct: boolean;
//   Producted: boolean; // 添加這個字段
//   courseDates: string[];
//   courseTimeRanges: {
//     id: string;
//     timeRange: string;
//     starttime: string | null;
//     endtime: string | null;
//   }[];
//   type: string[];
//   teacher: string[];
//   teacherId: string;
//   courseModulId: string | null;
//   createdAt: Date;
//   updatedAt: Date;
//   Students: string[];
//   // 其他可能存在的字段
//   Coursedates?: string[];
//   startTime?: string | null;
//   endTime?: string | null;
// }