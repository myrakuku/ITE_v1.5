// "use server";

// import { db } from "@/lib/db";
// import { CreateCourseSchema } from "./schema";
// import { InputType, ReturnType, CourseReturnType } from "./types";
// import { CreateSafeAction } from "@/lib/create-safe-action";


// type TimeRangeValue = "morning" | "afternoon" | "evening" | "full_day";

// const handler = async (data: InputType): Promise<ReturnType> => {
//   try {
//     const validatedData = CreateCourseSchema.parse(data);

//     const {
//       title,
//       description,
//       courseCode,
//       schoolName,
//       numberOfDays,
//       timeHours,
//       timeRange = [],
//       teacher,
//       isPublic,
//       isProduct,
//       type,
//       courseModulId,
//       teacherId,
//       startDate,
//       endDate,
//       starttime,
//       endtime,
//       Coursedates = [],
//       classroom, // 新增課室欄位
//     } = validatedData;

//     let courseModul = null;
//     if (courseModulId) {
//       courseModul = await db.courseModul.findUnique({
//         where: { id: courseModulId },
//         select: { id: true },
//       });

//       if (!courseModul) {
//         return {
//           error: "課程模組不存在",
//         };
//       }
//     }

//     const teacherExists = await db.user.findUnique({
//       where: { id: teacherId },
//       select: { id: true, name: true },
//     });

//     if (!teacherExists) {
//       return {
//         error: "教師 ID 不存在",
//       };
//     }

//     const validTeachers = await db.user.findMany({
//       where: {
//         name: { in: teacher },
//         role: "TEACHER",
//       },
//       select: { name: true },
//     });

//     if (validTeachers.length !== teacher.length) {
//       return {
//         error: "部分教師名稱無效或不是教師角色",
//       };
//     }

//     const validTypes = await db.coursePorductType.findMany({
//       where: {
//         id: { in: type },
//       },
//       select: { id: true },
//     });

//     if (validTypes.length !== type.length) {
//       return {
//         error: "部分課程類型無效",
//       };
//     }

//     const validTimeRangeValues: TimeRangeValue[] = ["morning", "afternoon", "evening", "full_day"];
//     const isValidTimeRange = timeRange.every((value) => validTimeRangeValues.includes(value));
//     if (!isValidTimeRange) {
//       return {
//         error: "無效的 TimeRange 值",
//       };
//     }

//     const course_data = await db.course.create({
//       data: {
//         title,
//         description,
//         courseCode,
//         schoolName,
//         numberOfDays,
//         timeHours,
//         timeRange: timeRange as string[],
//         teacher,
//         teacherId,
//         isPublic,
//         isProduct,
//         type,
//         startDate,
//         endDate,
//         starttime,
//         endtime,
//         Coursedates,
//         classroom, // 新增課室欄位
//         CourseModul: courseModulId ? { connect: { id: courseModulId } } : undefined,
//       },
//     });

//     const formattedCourseData: CourseReturnType = {
//       id: course_data.id,
//       title: course_data.title,
//       description: course_data.description,
//       courseCode: course_data.courseCode,
//       schoolName: course_data.schoolName,
//       numberOfDays: course_data.numberOfDays,
//       timeHours: course_data.timeHours,
//       timeRange: course_data.timeRange as TimeRangeValue[],
//       teacher: course_data.teacher,
//       teacherId: course_data.teacherId,
//       isPublic: course_data.isPublic,
//       type: course_data.type,
//       courseModulId: course_data.courseModulId,
//       startDate: course_data.startDate,
//       endDate: course_data.endDate,
//       starttime: course_data.starttime,
//       endtime: course_data.endtime,
//       Coursedates: course_data.Coursedates,
//       classroom: course_data.classroom, // 新增課室欄位
//       createdAt: course_data.createdAt,
//       updatedAt: course_data.updatedAt,
//     };

//     console.log("-- Create course on server -- : ", formattedCourseData, "-- End --");

//     return {
//       data: formattedCourseData,
//     };
//   } catch (error) {
//     console.error("CreateCourseAction error: ", error);
//     return {
//       error: error instanceof Error ? error.message : "創建課程失敗，請稍後重試",
//     };
//   }
// };

// export const CreateCourseAction = CreateSafeAction(CreateCourseSchema, handler);

// app/actions/Create/Create_Course/index.ts
'use server';

import { db } from '@/lib/db';
import { CreateCourseSchema } from './schema';
import { InputType, ReturnType, CourseReturnType } from './types';
import { CreateSafeAction } from '@/lib/create-safe-action';
import { Prisma } from '@prisma/client';

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    const validatedData = CreateCourseSchema.parse(data);

    const {
      title,
      description,
      courseCode,
      schoolName,
      numberOfDays,
      timeHours,
      timeRange = [],
      teacher,
      isPublic,
      isProduct,
      type,
      courseModulId,
      teacherId,
      startDate,
      endDate,
      Coursedates = [],
      weekday,
      classroom,
      Producted,
    } = validatedData;

    // 驗證 courseModulId
    let courseModul = null;
    if (courseModulId) {
      courseModul = await db.courseModul.findUnique({
        where: { id: courseModulId },
        select: { id: true },
      });

      if (!courseModul) {
        return {
          error: '課程模組不存在',
        };
      }
    }

    // 驗證教師 ID
    const teacherExists = await db.user.findUnique({
      where: { id: teacherId },
      select: { id: true, name: true },
    });

    if (!teacherExists) {
      return {
        error: '教師 ID 不存在',
      };
    }

    // 驗證教師名稱
    const validTeachers = await db.user.findMany({
      where: {
        name: { in: teacher },
        role: 'TEACHER',
      },
      select: { name: true },
    });

    if (validTeachers.length !== teacher.length) {
      return {
        error: '部分教師名稱無效或不是教師角色',
      };
    }

    // 驗證課程類型
    const validTypes = await db.courseProductType.findMany({
      where: {
        id: { in: type },
      },
      select: { id: true },
    });

    if (validTypes.length !== type.length) {
      return {
        error: '部分課程類型無效',
      };
    }

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
      isProductItem :false,
      type,
      startDate,
      endDate,
      Coursedates,
      weekday,
      classroom,
      Producted,
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

    // 創建課程
    const course_data = await db.course.create({
      data: courseData,
      include: {
        CourseTimeRanges: true,
      },
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
    };

    console.log('-- Create course on server -- : ', formattedCourseData, '-- End --');

    return {
      data: formattedCourseData,
    };
  } catch (error) {
    console.error('CreateCourseAction error: ', error);
    return {
      error: error instanceof Error ? error.message : '創建課程失敗，請稍後重試',
    };
  }
};

export const CreateCourseAction = CreateSafeAction(CreateCourseSchema, handler);