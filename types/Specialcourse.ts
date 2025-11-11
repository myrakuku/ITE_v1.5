// types/Specialcourse.ts

export interface SpecialCourse {
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
  maxStudents: number | null;
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
  price: number;
  real_price: number;
  Target_Audience: string | null;
  Course_Objective: string | null;
  Applicable_Scenarios: string | null;
  createdAt: Date;
  updatedAt: Date;
  Students: string[];

  // === 新增：圖片與影片 JSON 欄位 ===
  IMG_URL?: {
    images: {
      id: string;
      img_url: string;
    }[];
  } | null;

  Video_URL?: {
    id: string;
    video_url: string;
  }[] | null;
}

// 創建一個用於 API 響應的寬鬆類型（保留原有）
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

  // API 也可能返回這些欄位
  IMG_URL?: any;
  Video_URL?: any;
}