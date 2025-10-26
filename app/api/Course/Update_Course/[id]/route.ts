'use server';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';
import { Course } from '@prisma/client';
import { auth } from '@/auth';

// 定義與 select 匹配的 CourseTimeRange 型別
interface SelectedCourseTimeRange {
  id: string;
  timeRange: string;
  starttime: string | null;
  endtime: string | null;
}

const UpdateCourseSchema = z.object({
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

interface CourseWithTimeRanges extends Course {
  CourseTimeRanges: SelectedCourseTimeRange[];
  Students: string[]; // 新增
}

interface ErrorResponse {
  error: string;
  details?: unknown;
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<CourseWithTimeRanges | ErrorResponse>> {
  try {
    const { id } = await context.params;
    const body = await req.json();

    console.log('-- 接收到的課程更新數據 --:', body, '-- 結束 --');

    // 驗證輸入資料
    const validatedData = UpdateCourseSchema.parse(body);
    console.log('驗證後的數據:', validatedData);

    // 檢查權限
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: '未授權' }, { status: 401 });
    }

    // 檢查課程是否存在並屬於當前用戶
    const course = await db.course.findUnique({
      where: { id },
      select: { id: true, teacherId: true },
    });

    if (!course) {
      return NextResponse.json({ error: '課程不存在' }, { status: 404 });
    }

    if (course.teacherId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: '無權更新此課程' }, { status: 403 });
    }

    // 使用事務更新課程和時間範圍
    await db.$transaction([
      // 更新課程基本資料
      db.course.update({
        where: { id },
        data: {
          startDate: validatedData.startDate,
          endDate: validatedData.endDate,
          Coursedates: validatedData.Coursedates
            ? { set: validatedData.Coursedates }
            : undefined,
          weekday: validatedData.weekday,
          classroom: validatedData.classroom,
          maxStudents: validatedData.maxStudents, // 新增
        },
      }),
      // 清空現有 CourseTimeRange
      db.courseTimeRange.deleteMany({
        where: { courseId: id },
      }),
      // 創建新的 CourseTimeRange（如果提供）
      ...(validatedData.CourseTimeRanges && validatedData.CourseTimeRanges.length > 0
        ? [
            db.courseTimeRange.createMany({
              data: validatedData.CourseTimeRanges.map((tr) => ({
                courseId: id,
                timeRange: tr.timeRange,
                starttime: tr.starttime,
                endtime: tr.endtime,
              })),
            }),
          ]
        : []),
    ]);

    // 獲取更新後的課程
    const finalCourse = await db.course.findUnique({
      where: { id },
      include: {
        CourseTimeRanges: {
          select: {
            id: true,
            timeRange: true,
            starttime: true,
            endtime: true,
          },
        },
      },
    });

    if (!finalCourse) {
      return NextResponse.json({ error: '無法獲取更新後的課程' }, { status: 500 });
    }

    console.log('更新後的 Coursedates:', finalCourse.Coursedates);
    return NextResponse.json({
      ...finalCourse,
      CourseTimeRanges: finalCourse.CourseTimeRanges,
      Students: finalCourse.Students || [], // 新增
    });
  } catch (error) {
    console.error('UpdateCourse error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: '輸入資料無效', details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '更新課程失敗' },
      { status: 500 },
    );
  }
}



// 'use server';

// import { NextRequest, NextResponse } from 'next/server';
// import { db } from '@/lib/db';
// import { z } from 'zod';
// import { Course } from '@prisma/client';
// import { auth } from '@/auth';

// // 定義與 select 匹配的 CourseTimeRange 型別
// interface SelectedCourseTimeRange {
//   id: string;
//   timeRange: string;
//   starttime: string | null;
//   endtime: string | null;
// }

// const UpdateCourseSchema = z.object({
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

// interface CourseWithTimeRanges extends Course {
//   CourseTimeRanges: SelectedCourseTimeRange[];
// }

// interface ErrorResponse {
//   error: string;
//   details?: unknown;
// }

// export async function PATCH(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> },
// ): Promise<NextResponse<CourseWithTimeRanges | ErrorResponse>> {
//   try {
//     const { id } = await context.params;
//     const body = await req.json();

//     console.log('-- 接收到的課程更新數據 --:', body, '-- 結束 --');

//     // 驗證輸入資料
//     const validatedData = UpdateCourseSchema.parse(body);
//     console.log('驗證後的數據:', validatedData);

//     // 檢查權限
//     const session = await auth();
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: '未授權' }, { status: 401 });
//     }

//     // 檢查課程是否存在並屬於當前用戶
//     const course = await db.course.findUnique({
//       where: { id },
//       select: { id: true, teacherId: true },
//     });

//     if (!course) {
//       return NextResponse.json({ error: '課程不存在' }, { status: 404 });
//     }

//     if (course.teacherId !== session.user.id && session.user.role !== 'ADMIN') {
//       return NextResponse.json({ error: '無權更新此課程' }, { status: 403 });
//     }

//     // 使用事務更新課程和時間範圍
//     await db.$transaction([
//       // 更新課程基本資料
//       db.course.update({
//         where: { id },
//         data: {
//           startDate: validatedData.startDate,
//           endDate: validatedData.endDate,
//           Coursedates: validatedData.Coursedates
//             ? { set: validatedData.Coursedates }
//             : undefined,
//           weekday: validatedData.weekday,
//           classroom: validatedData.classroom,
//         },
//       }),
//       // 清空現有 CourseTimeRange
//       db.courseTimeRange.deleteMany({
//         where: { courseId: id },
//       }),
//       // 創建新的 CourseTimeRange（如果提供）
//       ...(validatedData.CourseTimeRanges && validatedData.CourseTimeRanges.length > 0
//         ? [
//             db.courseTimeRange.createMany({
//               data: validatedData.CourseTimeRanges.map((tr) => ({
//                 courseId: id,
//                 timeRange: tr.timeRange,
//                 starttime: tr.starttime,
//                 endtime: tr.endtime,
//               })),
//             }),
//           ]
//         : []),
//     ]);

//     // 獲取更新後的課程
//     const finalCourse = await db.course.findUnique({
//       where: { id },
//       include: {
//         CourseTimeRanges: {
//           select: {
//             id: true,
//             timeRange: true,
//             starttime: true,
//             endtime: true,
//           },
//         },
//       },
//     });

//     if (!finalCourse) {
//       return NextResponse.json({ error: '無法獲取更新後的課程' }, { status: 500 });
//     }

//     console.log('更新後的 Coursedates:', finalCourse.Coursedates);
//     return NextResponse.json(finalCourse);
//   } catch (error) {
//     console.error('UpdateCourse error:', error);
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         { error: '輸入資料無效', details: error.errors },
//         { status: 400 },
//       );
//     }
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : '更新課程失敗' },
//       { status: 500 },
//     );
//   }
// }