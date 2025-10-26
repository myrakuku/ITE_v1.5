// types/product.ts
export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  real_price: number;
  IsPublic: boolean;
  CourseProductTypeArray?: string[];
  CourseProductStatusArray?: string[];
  courseId?: string | null;
  imageUrls?: string[];
  videoUrls?: string;
  Target_Audience?: string | null;
  Course_Objective?: string | null;
  Applicable_Scenarios?: string | null;
  courseDates?: string[];
  courseTimeRanges?: {
    timeRange: string;
    startTime?: string | null;
    endTime?: string | null;
  }[];
  images?: File[];
}

export interface CourseDateFormData {
  startDate?: string | null;
  endDate?: string | null;
  weekday?: string | null;
  classroom?: string | null;
  timeRanges?: {
    timeRange: string;
    startTime?: string | null;
    endTime?: string | null;
  }[];
}