// Create a shared types file, e.g., @/types/course.ts
export type TimeRange = 'morning' | 'afternoon' | 'evening' | 'full_day';

export interface Course {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  schoolName: string;
  numberOfDays: number;
  timeHours: number;
  CourseTimeRanges: {
    id: string;
    timeRange: TimeRange;
    starttime: string | null;
    endtime: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  }[];
  teacher: string[];
  teacherId: string;
  isPublic: boolean;
  type: string[];
  courseModulId: string | null;
  startDate: string | null;
  endDate: string | null;
  startTime: string | null;
  endTime: string | null;
  Coursedates: string[];
  weekday: string | null;
  classroom: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  Producted: boolean;
  // Add any other fields that might be returned from the server
  CourseTypes?: string | null;
  timeRange?: string[];
  Students?: string[];
  isProduct?: boolean;
}