// 'use server';

// import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import { z } from 'zod';
// import { specialCourse } from '@prisma/client';
// import { auth } from '@/auth';

// // 定義與 select 匹配的 SpecialCourseTimeRange 型別
// interface SelectedSpecialCourseTimeRange {
//   id: string;
//   timeRange: string;
//   starttime: string | null;
//   endtime: string | null;
// }

// // 更新 schema
// const UpdateSpecialCourseSchema = z.object({
//   startDate: z.string().optional().nullable(),
//   endDate: z.string().optional().nullable(),
//   CourseTimeRanges: z
//     .array(
//       z.object({
//         timeRange: z.enum(['morning', 'afternoon', 'evening', 'full_day']),
//         starttime: z.string().optional().nullable(),
//         endtime: z.string().optional().nullable(),
//       }),
//     )
//     .optional(),
//   Coursedates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
//   weekday: z.string().optional().nullable(),
//   classroom: z.string().optional().nullable(),
// });

// // 創建 schema
// const CreateSpecialCourseSchema = UpdateSpecialCourseSchema.extend({
//   title: z.string().min(1, "標題不能為空"),
//   description: z.string().min(1, "描述不能為空"),
//   courseCode: z.string().min(1, "課程代碼不能為空"),
//   schoolName: z.string().min(1, "學校名稱不能為空"),
//   numberOfDays: z.number().min(1, "天數必須大於 0"),
//   numberOfStudents: z.number().min(1, "學生數必須大於 0"),
//   timeHours: z.number().min(1, "小時數必須大於 0"),
//   teacher: z.array(z.string()).min(1, "至少一名教師"),
//   teacherId: z.string().uuid("無效的教師 ID"),
//   isPublic: z.boolean(),
//   isProduct: z.boolean(),
//   type: z.array(z.string()),
//   courseModulId: z.string().uuid("無效的課程模組 ID").optional().nullable(),
//   Producted: z.boolean().default(false),
// });

// interface SpecialCourseWithTimeRanges extends specialCourse {
//   CourseTimeRanges: SelectedSpecialCourseTimeRange[];
// }

// interface ErrorResponse {
//   error: string;
//   details?: unknown;
// }

// export async function POST(req: NextRequest): Promise<NextResponse<SpecialCourseWithTimeRanges | ErrorResponse>> {
//   try {
//     const body = await req.json();
//     console.log('-- 接收到的特別課程創建數據 --:', body, '-- 結束 --');

//     const validatedData = CreateSpecialCourseSchema.parse(body);
//     console.log('驗證後的數據:', validatedData);

//     // 檢查權限
//     const session = await auth();
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: '未授權' }, { status: 401 });
//     }

//     // 使用事務創建課程和時間範圍
//     const createdSpecialCourse = await db.$transaction(async (tx) => {
//       const course = await tx.specialCourse.create({
//         data: {
//           title: validatedData.title,
//           description: validatedData.description,
//           courseCode: validatedData.courseCode,
//           schoolName: validatedData.schoolName,
//           numberOfDays: validatedData.numberOfDays,
//           numberOfStudents: validatedData.numberOfStudents,
//           timeHours: validatedData.timeHours,
//           teacher: validatedData.teacher,
//           teacherId: validatedData.teacherId,
//           isPublic: validatedData.isPublic,
//           isProduct: validatedData.isProduct,
//           Producted: validatedData.Producted,
//           type: validatedData.type,
//           courseModulId: validatedData.courseModulId,
//           startDate: validatedData.startDate,
//           endDate: validatedData.endDate,
//           Coursedates: validatedData.Coursedates || [],
//           weekday: validatedData.weekday,
//           classroom: validatedData.classroom,
//         },
//       });

//       console.log('創建的課程 ID:', course.id);

//       if (validatedData.CourseTimeRanges && validatedData.CourseTimeRanges.length > 0) {
//         await tx.specialCourseTimeRange.createMany({
//           data: validatedData.CourseTimeRanges.map((tr) => ({
//             courseId: course.id,
//             timeRange: tr.timeRange,
//             starttime: tr.starttime,
//             endtime: tr.endtime,
//           })),
//         });
//       }

//       return course;
//     });

//     // 獲取創建後的完整數據
//     const finalSpecialCourse = await db.specialCourse.findUnique({
//       where: { id: createdSpecialCourse.id },
//       include: {
//         SpecialCourseTimeRanges: {
//           select: {
//             id: true,
//             timeRange: true,
//             starttime: true,
//             endtime: true,
//           },
//         },
//       },
//     });

//     if (!finalSpecialCourse) {
//       return NextResponse.json({ error: '無法獲取創建後的課程' }, { status: 500 });
//     }

//     console.log('最終創建的課程:', finalSpecialCourse);
//     // 重命名 CourseTimeRanges 以匹配客戶端期望
//     return NextResponse.json({
//       ...finalSpecialCourse,
//       CourseTimeRanges: finalSpecialCourse.SpecialCourseTimeRanges,
//     });
//   } catch (error) {
//     console.error('CreateSpecialCourse error:', error);
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { error: '輸入資料無效', details: error.errors },
//         { status: 400 },
//       );
//     }
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : '創建課程失敗' },
//       { status: 500 },
//     );
//   }
// }

'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { specialCourse } from '@prisma/client';
import { auth } from '@/auth';

// 定義與 select 匹配的 SpecialCourseTimeRange 型別
interface SelectedSpecialCourseTimeRange {
  id: string;
  timeRange: string;
  starttime: string | null;
  endtime: string | null;
}

// 更新 schema
const UpdateSpecialCourseSchema = z.object({
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  CourseTimeRanges: z
    .array(
      z.object({
        timeRange: z.enum(['morning', 'afternoon', 'evening', 'full_day']),
        starttime: z.string().optional().nullable(),
        endtime: z.string().optional().nullable(),
      }),
    )
    .optional(),
  Coursedates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  weekday: z.string().optional().nullable(),
  classroom: z.string().optional().nullable(),
  maxStudents: z.number().int().min(1, { message: "人數上限必須為正整數" }).optional().nullable(), // 新增
});

// 創建 schema
const CreateSpecialCourseSchema = UpdateSpecialCourseSchema.extend({
  title: z.string().min(1, "標題不能為空"),
  description: z.string().min(1, "描述不能為空"),
  courseCode: z.string().min(1, "課程代碼不能為空"),
  schoolName: z.string().min(1, "學校名稱不能為空"),
  numberOfDays: z.number().min(1, "天數必須大於 0"),
  numberOfStudents: z.number().min(1, "學生數必須大於 0").nullable(),
  timeHours: z.number().min(1, "小時數必須大於 0"),
  teacher: z.array(z.string()).min(1, "至少一名教師"),
  teacherId: z.string().uuid("無效的教師 ID"),
  isPublic: z.boolean(),
  isProduct: z.boolean(),
  type: z.array(z.string()),
  courseModulId: z.string().uuid("無效的課程模組 ID").optional().nullable(),
  Producted: z.boolean().default(false),
});

interface SpecialCourseWithTimeRanges extends specialCourse {
  CourseTimeRanges: SelectedSpecialCourseTimeRange[];
}

interface ErrorResponse {
  error: string;
  details?: unknown;
}

export async function POST(req: NextRequest): Promise<NextResponse<SpecialCourseWithTimeRanges | ErrorResponse>> {
  try {
    const body = await req.json();
    console.log('-- 接收到的特別課程創建數據 --:', body, '-- 結束 --');

    const validatedData = CreateSpecialCourseSchema.parse(body);
    console.log('驗證後的數據:', validatedData);

    // 檢查權限
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    // 使用事務創建課程和時間範圍
    const createdSpecialCourse = await db.$transaction(async (tx) => {
      const course = await tx.specialCourse.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          courseCode: validatedData.courseCode,
          schoolName: validatedData.schoolName,
          numberOfDays: validatedData.numberOfDays,
          numberOfStudents: validatedData.numberOfStudents,
          maxStudents: validatedData.maxStudents, // 新增
          timeHours: validatedData.timeHours,
          teacher: validatedData.teacher,
          teacherId: validatedData.teacherId,
          isPublic: validatedData.isPublic,
          isProduct: validatedData.isProduct,
          Producted: validatedData.Producted,
          type: validatedData.type,
          courseModulId: validatedData.courseModulId,
          startDate: validatedData.startDate,
          endDate: validatedData.endDate,
          Coursedates: validatedData.Coursedates || [],
          weekday: validatedData.weekday,
          classroom: validatedData.classroom,
          Students: [], // 新增：初始為空數組
        },
      });

      console.log('創建的課程 ID:', course.id);

      if (validatedData.CourseTimeRanges && validatedData.CourseTimeRanges.length > 0) {
        await tx.specialCourseTimeRange.createMany({
          data: validatedData.CourseTimeRanges.map((tr) => ({
            courseId: course.id,
            timeRange: tr.timeRange,
            starttime: tr.starttime,
            endtime: tr.endtime,
          })),
        });
      }

      return course;
    });

    // 獲取創建後的完整數據
    const finalSpecialCourse = await db.specialCourse.findUnique({
      where: { id: createdSpecialCourse.id },
      include: {
        SpecialCourseTimeRanges: {
          select: {
            id: true,
            timeRange: true,
            starttime: true,
            endtime: true,
          },
        },
      },
    });

    if (!finalSpecialCourse) {
      return NextResponse.json({ error: '無法獲取創建後的課程' }, { status: 500 });
    }

    console.log('最終創建的課程:', finalSpecialCourse);
    // 重命名 CourseTimeRanges 以匹配客戶端期望
    return NextResponse.json({
      ...finalSpecialCourse,
      CourseTimeRanges: finalSpecialCourse.SpecialCourseTimeRanges,
      maxStudents: finalSpecialCourse.maxStudents, // 新增
      Students: finalSpecialCourse.Students, // 新增
    });
  } catch (error) {
    console.error('CreateSpecialCourse error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '輸入資料無效', details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '創建課程失敗' },
      { status: 500 },
    );
  }
}