"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import OSS from "ali-oss";
import { auth } from "@/auth";

// 定義表單數據結構
const UpdateSpecialCourseSchema = z.object({
  imgUrl: z.string().url("請輸入有效的圖片 URL").optional().nullable(),
  videoUrl: z.string().url("請輸入有效的影片 URL").optional().nullable(),
  price: z.number().min(0, "價格必須大於或等於 0").optional().nullable(),
});

// 定義 SpecialCourse 返回類型
interface SpecialCourse {
  id: string;
  IMG_URL: string | null;
  Video_URL: string | null;
  price: number | null;
  teacherId: string;
}

// 定義 Action 結果類型
interface ActionResult {
  data?: SpecialCourse;
  error?: string;
  details?: z.ZodIssue[];
}

// 圖片上傳 Server Action
export async function uploadImageToOSS(formData: FormData): Promise<{ url?: string | null; error?: string }> {
  try {
    const file = formData.get("file") as File;
    const courseId = formData.get("courseId") as string;

    if (!file || !courseId) {
      return { error: "缺少文件或課程 ID" };
    }

    const ossClient = new OSS({
      region: process.env.OSS_REGION,
      accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
      bucket: process.env.OSS_BUCKET,
      endpoint: process.env.OSS_ENDPOINT,
    });

    const fileName = `special-course/${courseId}/${Date.now()}_${file.name}`;
    const result = await ossClient.put(fileName, Buffer.from(await file.arrayBuffer()));
    return { url: result.url || null };
  } catch (error) {
    console.error("OSS Upload error:", error);
    return { error: "圖片上傳失敗" };
  }
}

// 更新課程數據 Server Action
export async function updateSpecialCourse(
  courseId: string,
  data: unknown,
): Promise<ActionResult> {
  try {
    // 驗證輸入數據
    const validatedData = UpdateSpecialCourseSchema.parse(data);

    // 檢查權限
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "未授權" };
    }

    // 檢查課程是否存在並屬於當前用戶
    const course = await db.specialCourse.findUnique({
      where: { id: courseId },
      select: { id: true, teacherId: true },
    });

    if (!course) {
      return { error: "課程不存在" };
    }

    if (course.teacherId !== session.user.id && session.user.role !== "ADMIN") {
      return { error: "無權更新此課程" };
    }

    // 更新課程數據
    const updatedCourse = await db.specialCourse.update({
      where: { id: courseId },
      data: {
        IMG_URL: validatedData.imgUrl,
        Video_URL: validatedData.videoUrl,
        price: validatedData.price,
      },
    });

    console.log("更新後的課程:", updatedCourse);
    return { data: updatedCourse };
  } catch (error) {
    console.error("UpdateSpecialCourse error:", error);
    if (error instanceof z.ZodError) {
      return { error: "輸入資料無效", details: error.errors };
    }
    return { error: error instanceof Error ? error.message : "更新課程失敗" };
  }
}



// // app/actions/Update/updateSpecialCourseMedia.ts
// 'use server';

// import { db } from '@/lib/db'; // 假設 Prisma 客戶端位於此路徑
// import { z } from 'zod';
// import OSS from 'ali-oss';
// import { auth } from '@/auth';

// // 定義表單數據結構
// const UpdateSpecialCourseSchema = z.object({
//   imgUrl: z.string().url("請輸入有效的圖片 URL").optional().nullable(),
//   videoUrl: z.string().url("請輸入有效的影片 URL").optional().nullable(),
//   price: z.number().min(0, "價格必須大於或等於 0").optional().nullable(),
// });

// // 圖片上傳 Server Action
// export async function uploadImageToOSS(formData: FormData): Promise<{ url?: string | null; error?: string }> {
//   try {
//     const file = formData.get('file') as File;
//     const courseId = formData.get('courseId') as string;

//     if (!file || !courseId) {
//       return { error: '缺少文件或課程 ID' };
//     }

// const ossClient = new OSS({
//   region: process.env.OSS_REGION,
//   accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
//   accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
//   bucket: process.env.OSS_BUCKET,
//   endpoint: process.env.OSS_ENDPOINT,
// });

//     const fileName = `special-course/${courseId}/${Date.now()}_${file.name}`;
//     const result = await ossClient.put(fileName, Buffer.from(await file.arrayBuffer()));
//     return { url: result.url || null }; // 確保返回 string | null
//   } catch (error) {
//     console.error('OSS Upload error:', error);
//     return { error: '圖片上傳失敗' };
//   }
// }

// // 更新課程數據 Server Action
// export async function updateSpecialCourse(
//   courseId: string,
//   data: unknown,
// ): Promise<{ data?: any; error?: string; details?: any }> {
//   try {
//     // 驗證輸入數據
//     const validatedData = UpdateSpecialCourseSchema.parse(data);

//     // 檢查權限
//     const session = await auth();
//     if (!session?.user?.id) {
//       return { error: '未授權' };
//     }

//     // 檢查課程是否存在並屬於當前用戶
//     const course = await db.specialCourse.findUnique({
//       where: { id: courseId },
//       select: { id: true, teacherId: true },
//     });

//     if (!course) {
//       return { error: '課程不存在' };
//     }

//     if (course.teacherId !== session.user.id && session.user.role !== 'ADMIN') {
//       return { error: '無權更新此課程' };
//     }

//     // 更新課程數據
//     const updatedCourse = await db.specialCourse.update({
//       where: { id: courseId },
//       data: {
//         IMG_URL: validatedData.imgUrl,
//         Video_URL: validatedData.videoUrl,
//         price: validatedData.price,
//       },
//     });

//     console.log('更新後的課程:', updatedCourse);
//     return { data: updatedCourse };
//   } catch (error) {
//     console.error('UpdateSpecialCourse error:', error);
//     if (error instanceof z.ZodError) {
//       return { error: '輸入資料無效', details: error.errors };
//     }
//     return { error: error instanceof Error ? error.message : '更新課程失敗' };
//   }
// }