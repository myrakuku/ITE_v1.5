// index.ts
'use server';

import { db } from '@/lib/db';
import { CreateCourseSchema } from './schema'; // 只導入 CreateCourseSchema
import { InputType, ReturnType, CourseReturnType } from './types';
import { CreateSafeAction } from '@/lib/create-safe-action';
import { Prisma } from '@prisma/client';

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    const {
      title,
      description,
      courseCode,
      schoolName,
      numberOfDays,
      timeHours,
      timeRange, // 現在保證是數組
      teacher,
      isPublic,
      isProduct,
      type,
      courseModulId,
      teacherId,
      startDate,
      endDate,
      Coursedates,
      weekday,
      classroom,
      Producted,
      numberOfStudents,
      Students,
    } = data;

    // ... 原有的驗證邏輯

    // 準備課程創建數據
    const courseData: Prisma.CourseCreateInput = {
      title,
      description,
      courseCode,
      schoolName,
      numberOfDays,
      timeHours,
      teacher,
      isPublic,
      isProduct,
      isProductItem: false,
      type,
      startDate,
      endDate,
      Coursedates,
      weekday,
      classroom,
      Producted,
      numberOfStudents,
      Students,
      Teacher: {
        connect: { id: teacherId },
      },
      CourseTimeRanges: {
        create: timeRange.map((range) => ({
          timeRange: range.timeRange,
          starttime: range.starttime,
          endtime: range.endtime,
        })),
      },
      ...(courseModulId && {
        CourseModul: { connect: { id: courseModulId } },
      }),
    };

    // 在事務中創建課程
    const course_data = await db.$transaction(async (tx) => {
      const course = await tx.course.create({
        data: courseData,
        include: {
          CourseTimeRanges: true,
        },
      });
      return course;
    });

    // 格式化返回資料
    const formattedCourseData: CourseReturnType = {
      id: course_data.id,
      title: course_data.title,
      description: course_data.description,
      courseCode: course_data.courseCode,
      schoolName: course_data.schoolName,
      numberOfDays: course_data.numberOfDays,
      timeHours: course_data.timeHours,
      timeRange: course_data.CourseTimeRanges.map((range) => ({
        id: range.id,
        timeRange: range.timeRange as 'morning' | 'afternoon' | 'evening' | 'full_day',
        starttime: range.starttime,
        endtime: range.endtime,
        createdAt: range.createdAt,
        updatedAt: range.updatedAt,
      })),
      teacher: course_data.teacher,
      teacherId: course_data.teacherId,
      isPublic: course_data.isPublic,
      isProduct: course_data.isProduct,
      type: course_data.type,
      courseModulId: course_data.courseModulId,
      startDate: course_data.startDate,
      endDate: course_data.endDate,
      Coursedates: course_data.Coursedates,
      weekday: course_data.weekday,
      classroom: course_data.classroom,
      createdAt: course_data.createdAt,
      updatedAt: course_data.updatedAt,
      Producted: course_data.Producted,
      numberOfStudents: course_data.numberOfStudents,
      Students: course_data.Students,
    };

    console.log('-- Create course on server -- : ', {
      courseId: course_data.id,
      title: course_data.title,
      teacherId,
      timeRanges: course_data.CourseTimeRanges,
    }, '-- End --');

    return { data: formattedCourseData };
  } catch (error) {
    console.error('CreateCourseAction error: ', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { error: '課程代碼已存在，請使用其他代碼' };
      }
    }
    return { error: '創建課程失敗，請稍後重試' };
  }
};

// 直接使用 CreateCourseSchema，移除適配器函數
export const CreateCourseAction = CreateSafeAction(CreateCourseSchema, handler);