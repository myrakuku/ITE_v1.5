

// // app/actions/Create/Create_CourseTeacher/index.ts
// 'use server';

// import { db } from '@/lib/db';
// import { CreateCourseTeacherSchema } from './schema';
// import { InputType, ReturnType, CourseReturnType } from './types';
// import { CreateSafeAction } from '@/lib/create-safe-action';
// import { Prisma } from '@prisma/client';

// const handler = async (data: InputType): Promise<ReturnType> => {
//   try {
//     const validatedData = CreateCourseTeacherSchema.parse(data);

//     const {
//       title,
//       description,
//       courseCode,
//       schoolName,
//       numberOfDays,
//       timeHours,
//       timeRanges,
//       teacher,
//       isPublic,
//       isProduct,
//       type,
//       courseModuleId,
//       teacherId,
//       startDate,
//       endDate,
//       courseDates ,
//       classroom,
//       weekday,
//     } = validatedData;

//     // 驗證 courseModuleId
//     let courseModul = null;
//     if (courseModuleId) {
//       courseModul = await db.courseModul.findUnique({
//         where: { id: courseModuleId },
//         select: { id: true },
//       });

//       if (!courseModul) {
//         return {
//           error: '課程模組不存在',
//         };
//       }
//     }

//     // 驗證教師 ID
//     const teacherExists = await db.user.findUnique({
//       where: { id: teacherId },
//       select: { id: true, name: true },
//     });

//     if (!teacherExists) {
//       return {
//         error: '教師 ID 不存在',
//       };
//     }

//     // 驗證教師名稱
//     const validTeachers = await db.user.findMany({
//       where: {
//         name: { in: teacher },
//         role: 'TEACHER',
//       },
//       select: { name: true },
//     });

//     if (validTeachers.length !== teacher.length) {
//       return {
//         error: '部分教師名稱無效或不是教師角色',
//       };
//     }

//     // 驗證課程類型
//     const validTypes = await db.courseProductType.findMany({
//       where: {
//         id: { in: type },
//       },
//       select: { id: true },
//     });

//     if (validTypes.length !== type.length) {
//       return {
//         error: '部分課程類型無效',
//       };
//     }

//     // 驗證 timeRanges
//     const validTimeRangeValues = ['morning', 'afternoon', 'evening', 'full_day'];
//     const isValidTimeRange = timeRanges.every((range) =>
//       validTimeRangeValues.includes(range.timeRange)
//     );
//     if (timeRanges.length > 0 && !isValidTimeRange) {
//       return {
//         error: '無效的 TimeRange 值',
//       };
//     }

//      // 在创建 CourseTimeRanges 时检查是否存在
//     const courseData: Prisma.CourseCreateInput = {
//       title,
//       description,
//       courseCode,
//       schoolName,
//       numberOfDays,
//       timeHours,
//       teacher,
//       isPublic,
//       isProduct,
//       Producted: false,
//       isProductItem: false,
//       type,
//       startDate,
//       endDate,
//       Coursedates: courseDates || [], // 确保有默认值在这里设置
//       classroom,
//       weekday,
//       Teacher: {
//         connect: { id: teacherId },
//       },
//       // 只在 timeRanges 存在时创建关联
//       ...(timeRanges && timeRanges.length > 0 && {
//         CourseTimeRanges: {
//           create: timeRanges.map((range) => ({
//             timeRange: range.timeRange,
//             starttime: range.starttime,
//             endtime: range.endtime,
//           })),
//         },
//       }),
//       ...(courseModuleId && {
//         CourseModul: { connect: { id: courseModuleId } },
//       }),
//     };

//     // 創建課程
//     const course = await db.course.create({
//       data: courseData,
//       include: {
//         CourseTimeRanges: true,
//       },
//     });

//     // 格式化返回數據
//     const formattedCourseData: CourseReturnType = {
//       id: course.id,
//       title: course.title,
//       description: course.description,
//       courseCode: course.courseCode,
//       schoolName: course.schoolName,
//       numberOfDays: course.numberOfDays,
//       timeHours: course.timeHours,
//       timeRanges: course.CourseTimeRanges.map((range) => ({
//         id: range.id,
//         timeRange: range.timeRange as 'morning' | 'afternoon' | 'evening' | 'full_day',
//         starttime: range.starttime,
//         endtime: range.endtime,
//         createdAt: range.createdAt,
//         updatedAt: range.updatedAt,
//       })),
//       teacher: course.teacher,
//       teacherId: course.teacherId,
//       isPublic: course.isPublic,
//       isProduct: course.isProduct,
//       Producted: course.Producted,
//       type: course.type,
//       courseModuleId: course.courseModulId,
//       startDate: course.startDate,
//       endDate: course.endDate,
//       courseDates: course.Coursedates,
//       classroom: course.classroom,
//       weekday: course.weekday,
//       createdAt: course.createdAt,
//       updatedAt: course.updatedAt,
//     };

//     console.log('-- Create course on server -- : ', formattedCourseData, '-- End --');

//     return {
//       data: formattedCourseData,
//     };
//   } catch (error) {
//     console.error('CreateCourseTeacherAction error: ', error);
//     return {
//       error: error instanceof Error ? error.message : '創建課程失敗，請稍後重試',
//     };
//   }
// };

// export const CreateCourseTeacherAction = CreateSafeAction(CreateCourseTeacherSchema, handler);




// app/actions/Create/Create_CourseTeacher/index.ts
'use server';

import { db } from '@/lib/db';
import { CreateCourseTeacherSchema } from './schema';
import { InputType, ReturnType, CourseReturnType } from './types';
import { CreateSafeAction } from '@/lib/create-safe-action';
import { Prisma } from '@prisma/client';

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    const validatedData = CreateCourseTeacherSchema.parse(data);

    const {
      title,
      description,
      courseCode,
      schoolName,
      numberOfDays,
      timeHours,
      timeRanges = [],
      teacher,
      isPublic,
      isProduct,
      type,
      courseModuleId,
      teacherId,
      startDate,
      endDate,
      courseDates = [],
      classroom,
      weekday,
    } = validatedData;

    // 驗證 courseModuleId
    let courseModul = null;
    if (courseModuleId) {
      courseModul = await db.courseModul.findUnique({
        where: { id: courseModuleId },
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

    // 驗證 timeRanges
    const validTimeRangeValues = ['morning', 'afternoon', 'evening', 'full_day'];
    const isValidTimeRange = timeRanges.every((range) =>
      validTimeRangeValues.includes(range.timeRange)
    );
    if (timeRanges.length > 0 && !isValidTimeRange) {
      return {
        error: '無效的 TimeRange 值',
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
      Producted: false, // 直接設置為 false，不從 validatedData 解構
      isProductItem: false,
      type,
      startDate,
      endDate,
      Coursedates: courseDates,
      classroom,
      weekday,
      Teacher: {
        connect: { id: teacherId },
      },
      CourseTimeRanges: {
        create: timeRanges.map((range) => ({
          timeRange: range.timeRange,
          starttime: range.starttime,
          endtime: range.endtime,
        })),
      },
      ...(courseModuleId && {
        CourseModul: { connect: { id: courseModuleId } },
      }),
    };

    // 創建課程
    const course = await db.course.create({
      data: courseData,
      include: {
        CourseTimeRanges: true,
      },
    });

    // 格式化返回數據
    const formattedCourseData: CourseReturnType = {
      id: course.id,
      title: course.title,
      description: course.description,
      courseCode: course.courseCode,
      schoolName: course.schoolName,
      numberOfDays: course.numberOfDays,
      timeHours: course.timeHours,
      timeRanges: course.CourseTimeRanges.map((range) => ({
        id: range.id,
        timeRange: range.timeRange as 'morning' | 'afternoon' | 'evening' | 'full_day',
        starttime: range.starttime,
        endtime: range.endtime,
        createdAt: range.createdAt,
        updatedAt: range.updatedAt,
      })),
      teacher: course.teacher,
      teacherId: course.teacherId,
      isPublic: course.isPublic,
      isProduct: course.isProduct,
      Producted: course.Producted,
      type: course.type,
      courseModuleId: course.courseModulId,
      startDate: course.startDate,
      endDate: course.endDate,
      courseDates: course.Coursedates,
      classroom: course.classroom,
      weekday: course.weekday,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };

    console.log('-- Create course on server -- : ', formattedCourseData, '-- End --');

    return {
      data: formattedCourseData,
    };
  } catch (error) {
    console.error('CreateCourseTeacherAction error: ', error);
    return {
      error: error instanceof Error ? error.message : '創建課程失敗，請稍後重試',
    };
  }
};

export const CreateCourseTeacherAction = CreateSafeAction(CreateCourseTeacherSchema, handler);
