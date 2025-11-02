// // app/actions/Create/Create_SpecialCourse/index.ts
// 'use server';

// import { db } from '@/lib/db';
// import { CreateSpecialCourseSchema } from './schema';
// import { InputType, ReturnType, CourseReturnType } from './types';
// import { CreateSafeAction } from '@/lib/create-safe-action';
// import { Prisma } from '@prisma/client';

// const handler = async (data: InputType): Promise<ReturnType> => {
//   try {
//     // 確保所有字段都有值
//     const validatedData = {
//       ...data,
//       type: data.type ?? [],
//       Producted: data.Producted ?? false,
//       timeRange: data.timeRange ?? [],
//       Coursedates: data.Coursedates ?? [],
//       startDate: data.startDate ?? null,
//       endDate: data.endDate ?? null,
//       weekday: data.weekday ?? null,
//       classroom: data.classroom ?? null,
//       courseModulId: data.courseModulId ?? null,
//       maxStudents: data.maxStudents ?? null,
//     };

//     const {
//       title,
//       description,
//       courseCode,
//       schoolName,
//       numberOfDays,
//       numberOfStudents,
//       maxStudents,
//       timeHours,
//       timeRange,
//       teacher,
//       isPublic,
//       isProduct,
//       type,
//       courseModulId,
//       teacherId,
//       startDate,
//       endDate,
//       Coursedates,
//       weekday,
//       classroom,
//       Producted,
//     } = validatedData;

//     // 驗證 courseModulId
//     let courseModul = null;
//     if (courseModulId) {
//       courseModul = await db.courseModul.findUnique({
//         where: { id: courseModulId },
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

//     // 在事務中創建 specialCourse 和相關的時間範圍
//     const finalCourseData = await db.$transaction(async (tx) => {
//       // 創建 specialCourse 數據 - 移除 Students 字段或正確處理
//       const courseData: Prisma.specialCourseCreateInput = {
//         title,
//         description,
//         courseCode,
//         schoolName,
//         numberOfDays,
//         numberOfStudents,
//         maxStudents,
//         timeHours,
//         teacher,
//         isPublic,
//         isProduct,
//         Producted,
//         type,
//         startDate,
//         endDate,
//         Coursedates,
//         weekday,
//         classroom,
//         // 移除 Students: []，因為它應該通過關係處理
//         Teacher: {
//           connect: { id: teacherId },
//         },
//         CoursePorductType: {
//           connect: type.map(id => ({ id })),
//         },
//         ...(courseModulId && {
//           CourseModul: { connect: { id: courseModulId } },
//         }),
//       };

//       // 創建 specialCourse
//       const course_data = await tx.specialCourse.create({
//         data: courseData,
//       });

//       // 創建 SpecialCourseTimeRanges
//       if (timeRange.length > 0) {
//         await tx.specialCourseTimeRange.createMany({
//           data: timeRange.map(range => ({
//             timeRange: range.timeRange,
//             starttime: range.starttime,
//             endtime: range.endtime,
//             courseId: course_data.id,
//           })),
//         });
//       }

//       // 查詢最終的 specialCourse 數據，包括 SpecialCourseTimeRanges 和 Students
//       return await tx.specialCourse.findUnique({
//         where: { id: course_data.id },
//         include: {
//           SpecialCourseTimeRanges: true,
//           Teacher: true,
//           CourseModul: true,
//           CoursePorductType: true,
//           Students: true, // 包含 Students 關係
//         },
//       });
//     });

//     if (!finalCourseData) {
//       return {
//         error: '無法獲取創建的課程數據',
//       };
//     }

//     // 格式化返回數據
//     const formattedCourseData: CourseReturnType = {
//       id: finalCourseData.id,
//       title: finalCourseData.title,
//       description: finalCourseData.description,
//       courseCode: finalCourseData.courseCode,
//       schoolName: finalCourseData.schoolName,
//       numberOfDays: finalCourseData.numberOfDays,
//       numberOfStudents: finalCourseData.numberOfStudents,
//       maxStudents: finalCourseData.maxStudents,
//       timeHours: finalCourseData.timeHours,
//       timeRange: finalCourseData.SpecialCourseTimeRanges.map((range) => ({
//         id: range.id,
//         timeRange: range.timeRange as 'morning' | 'afternoon' | 'evening' | 'full_day',
//         starttime: range.starttime,
//         endtime: range.endtime,
//         createdAt: range.createdAt,
//         updatedAt: range.updatedAt,
//       })),
//       teacher: finalCourseData.teacher,
//       teacherId: finalCourseData.teacherId,
//       isPublic: finalCourseData.isPublic,
//       isProduct: finalCourseData.isProduct,
//       type: finalCourseData.type,
//       courseModulId: finalCourseData.courseModulId,
//       startDate: finalCourseData.startDate,
//       endDate: finalCourseData.endDate,
//       Coursedates: finalCourseData.Coursedates,
//       weekday: finalCourseData.weekday,
//       classroom: finalCourseData.classroom,
//       createdAt: finalCourseData.createdAt,
//       updatedAt: finalCourseData.updatedAt,
//       Producted: finalCourseData.Producted,
//       Students: finalCourseData.Students.map(student => student.id), // 轉換為 ID 數組
//     };

//     console.log('-- Create SpecialCourse on server -- : ', formattedCourseData, '-- End --');

//     return {
//       data: formattedCourseData,
//     };
//   } catch (error) {
//     console.error('CreateSpecialCourseAction error: ', error);
//     if (error instanceof Prisma.PrismaClientKnownRequestError) {
//       if (error.code === 'P2002') {
//         return { error: '課程代碼已存在，請使用其他代碼' };
//       }
//     }
//     return {
//       error: error instanceof Error ? error.message : '創建特殊課程失敗，請稍後重試',
//     };
//   }
// };

// export const CreateSpecialCourseAction = CreateSafeAction(CreateSpecialCourseSchema, handler);