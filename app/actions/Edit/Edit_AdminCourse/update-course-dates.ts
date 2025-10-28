'use server';

import { prisma } from '@/lib/prisma';
import { auth, } from '@/auth'; // 使用 NextAuth v5 的 auth 方法
import { z } from 'zod';
import { UserRole } from '@prisma/client';

const CourseDateSchema = z.object({
  courseId: z.string().uuid(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  weekday: z.string().optional().nullable(),
  classroom: z.string().optional().nullable(),
  Coursedates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  CourseTimeRanges: z
    .array(
      z.object({
        timeRange: z.enum(['morning', 'afternoon', 'evening', 'full_day']),
        starttime: z.string().optional().nullable(),
        endtime: z.string().optional().nullable(),
      })
    )
    .optional(),
});

type CourseDateForm = z.infer<typeof CourseDateSchema>;

interface UpdateCourseResult {
  success: boolean;
  error?: string;
  course?: {
    id: string;
    title: string;
    description: string;
    courseCode: string;
    schoolName: string;
    CourseTypes?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    Coursedates: string[];
    numberOfDays: number;
    timeHours: number;
    timeRange: string[];
    teacher: string[];
    teacherId: string;
    isPublic: boolean;
    isProduct: boolean;
    Producted: boolean;
    Students: string[];
    type: string[];
    classroom?: string | null;
    weekday?: string | null;
    createdAt: Date;
    updatedAt: Date;
    courseModulId?: string | null;
    CourseTimeRanges: Array<{
      id: string;
      courseId: string;
      timeRange: string;
      starttime?: string | null;
      endtime?: string | null;
      createdAt: Date;
      updatedAt: Date;
    }>;
  };
}

export async function updateCourseDates(data: CourseDateForm): Promise<UpdateCourseResult> {
  try {
    // 驗證輸入數據
    const parsedData = CourseDateSchema.safeParse(data);
    if (!parsedData.success) {
      return { success: false, error: '無效的輸入數據：' + parsedData.error.message };
    }

    const { courseId, Coursedates, CourseTimeRanges, ...otherData } = parsedData.data;

    // 使用 NextAuth v5 的 auth() 方法获取 session
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: '未授權：請先登入' };
    }

    // 獲取課程並驗證權限
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, teacherId: true, numberOfDays: true },
    });

    if (!course) {
      return { success: false, error: '找不到課程' };
    }

    // 確保只有 ADMIN 或課程的教師可以修改
    if (session.user.role !== UserRole.ADMIN && course.teacherId !== session.user.id) {
      return { success: false, error: '無權操作：您不是該課程的教師' };
    }

    // 驗證 Coursedates 不超過 numberOfDays
    if (Coursedates && Coursedates.length > course.numberOfDays) {
      return {
        success: false,
        error: `課程日期數量（${Coursedates.length}）不能超過課程天數（${course.numberOfDays}）`,
      };
    }

    // 驗證日期範圍（如果提供了 startDate 和 endDate）
    if (otherData.startDate && otherData.endDate) {
      const start = new Date(otherData.startDate);
      const end = new Date(otherData.endDate);
      const daysDifference = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (daysDifference < course.numberOfDays) {
        return {
          success: false,
          error: `日期範圍（${daysDifference} 天）少於課程持續天數（${course.numberOfDays} 天）`,
        };
      }
    }

    // 更新課程數據
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        startDate: otherData.startDate,
        endDate: otherData.endDate,
        weekday: otherData.weekday,
        classroom: otherData.classroom,
        Coursedates: Coursedates || [],
        CourseTimeRanges: {
          // 先刪除現有的 CourseTimeRange
          deleteMany: {},
          // 創建新的 CourseTimeRange
          create: CourseTimeRanges?.map((range) => ({
            timeRange: range.timeRange,
            starttime: range.starttime,
            endtime: range.endtime,
          })),
        },
      },
      include: {
        CourseTimeRanges: true,
      },
    });

    return { success: true, course: updatedCourse };
  } catch (error) {
    console.error('更新課程失敗:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '無法更新課程',
    };
  }
}