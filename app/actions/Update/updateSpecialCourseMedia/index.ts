"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import OSS from "ali-oss";
import { auth } from "@/auth";

// 定義表單數據結構
const UpdateSpecialCourseSchema = z.object({
  imgUrl: z.string().url("請輸入有效的圖片 URL").optional().nullable(),
  videoUrl: z.string().url("請輸入有效的影片 URL").optional().nullable(),
  real_price: z.number().min(0, "價格必須大於或等於 0").optional().nullable(),
});

// 定義 SpecialCourse 返回類型
interface SpecialCourse {
  id: string;
  IMG_URL: Record<string, any> | null;
  Video_URL: Record<string, any> | null;
  real_price: number | null;
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
      region: process.env.OSS_REGION!,
      accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
      bucket: process.env.OSS_BUCKET!,
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

// 影片上傳 Server Action
export async function uploadVideoToOSS(formData: FormData): Promise<{ url?: string | null; error?: string }> {
  try {
    const file = formData.get("file") as File;
    const courseId = formData.get("courseId") as string;

    if (!file || !courseId) {
      return { error: "缺少文件或課程 ID" };
    }

    const ossClient = new OSS({
      region: process.env.OSS_REGION!,
      accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
      bucket: process.env.OSS_BUCKET!,
      endpoint: process.env.OSS_ENDPOINT,
    });

    const fileName = `special-course/videos/${courseId}/${Date.now()}_${file.name}`;
    const result = await ossClient.put(fileName, Buffer.from(await file.arrayBuffer()));
    return { url: result.url || null };
  } catch (error) {
    console.error("OSS Video Upload error:", error);
    return { error: "影片上傳失敗" };
  }
}

// 更新課程數據 Server Action
// updateSpecialCourseMedia.ts
export async function updateSpecialCourse(
  courseId: string,
  data: unknown,
): Promise<ActionResult> {
  try {
    const validatedData = UpdateSpecialCourseSchema.parse(data);

    const session = await auth();
    if (!session?.user?.id) return { error: "未授權" };

    const course = await db.specialCourse.findUnique({
      where: { id: courseId },
      select: { id: true, teacherId: true },
    });

    if (!course) return { error: "課程不存在" };
    if (course.teacherId !== session.user.id && session.user.role !== "ADMIN") {
      return { error: "無權更新此課程" };
    }

    const updateData: any = {};

    // 關鍵修正：統一處理所有欄位
    if (validatedData.imgUrl !== undefined) {
      updateData.IMG_URL = validatedData.imgUrl
        ? { url: validatedData.imgUrl, updatedAt: new Date().toISOString() }
        : null;
    }

    if (validatedData.videoUrl !== undefined) {
      updateData.Video_URL = validatedData.videoUrl
        ? { url: validatedData.videoUrl, updatedAt: new Date().toISOString() }
        : null;
    }

    if (validatedData.real_price !== undefined) {
      updateData.real_price = validatedData.real_price;  // ← 加入這行！
    }

    // 只有在有變更時才更新
    if (Object.keys(updateData).length === 0) {
      return { data: course as SpecialCourse };
    }

    const updatedCourse = await db.specialCourse.update({
      where: { id: courseId },
      data: updateData,
    });
    console.log("更新後的課程:", updatedCourse);
    return { data: updatedCourse as SpecialCourse };
  } catch (error) {
    console.error("UpdateSpecialCourse error:", error);
    if (error instanceof z.ZodError) {
      return { error: "輸入資料無效", details: error.errors };
    }
    return { error: error instanceof Error ? error.message : "更新課程失敗" };
  }
}

// 批量上傳媒體文件並更新課程
export async function uploadAndUpdateCourseMedia(
  courseId: string,
  formData: FormData,
): Promise<ActionResult> {
  try {
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

    const images = formData.getAll("images") as File[];
    const videos = formData.getAll("videos") as File[];

    const updateData: any = {};

    // 上傳圖片
    if (images.length > 0) {
      const imageResults = await Promise.all(
        images.map(async (file) => {
          const imageFormData = new FormData();
          imageFormData.append("file", file);
          imageFormData.append("courseId", courseId);
          return await uploadImageToOSS(imageFormData);
        })
      );

      const successfulImages = imageResults.filter(result => result.url);
      if (successfulImages.length > 0) {
        updateData.IMG_URL = {
          images: successfulImages.map(result => ({
            url: result.url,
            uploadedAt: new Date().toISOString(),
          })),
        };
      }
    }

    // 上傳影片
    if (videos.length > 0) {
      const videoResults = await Promise.all(
        videos.map(async (file) => {
          const videoFormData = new FormData();
          videoFormData.append("file", file);
          videoFormData.append("courseId", courseId);
          return await uploadVideoToOSS(videoFormData);
        })
      );

      const successfulVideos = videoResults.filter(result => result.url);
      if (successfulVideos.length > 0) {
        updateData.Video_URL = {
          videos: successfulVideos.map(result => ({
            url: result.url,
            uploadedAt: new Date().toISOString(),
          })),
        };
      }
    }

    // 如果有上傳的文件，更新課程
    if (Object.keys(updateData).length > 0) {
      const updatedCourse = await db.specialCourse.update({
        where: { id: courseId },
        data: updateData,
      });

      console.log("更新媒體後的課程:", updatedCourse);
      return { data: updatedCourse as SpecialCourse };
    }

    return { error: "沒有文件上傳成功" };
  } catch (error) {
    console.error("UploadAndUpdateCourseMedia error:", error);
    return { error: error instanceof Error ? error.message : "上傳媒體文件失敗" };
  }
}