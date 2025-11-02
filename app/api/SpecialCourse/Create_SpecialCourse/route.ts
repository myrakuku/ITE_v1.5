// app/api/SpecialCourse/Create_SpecialCourse/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import OSS from "ali-oss";
import { randomUUID } from "crypto";

const ossClient = new OSS({
  region: process.env.OSS_REGION!,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
  bucket: process.env.OSS_BUCKET!,
  endpoint: process.env.OSS_ENDPOINT,
});

const uploadToOSS = async (file: File, path: string) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${path}/${randomUUID()}-${file.name}`;
  const result = await ossClient.put(fileName, buffer);
  return { id: randomUUID(), img_url: result.url };
};

// 解析時間段數據的輔助函數
function parseTimeRangesData(formData: FormData) {
  const timeRangesJson = formData.get("SpecialCourseTimeRanges") as string;
  if (timeRangesJson) {
    try {
      return JSON.parse(timeRangesJson);
    } catch (error) {
      console.error("解析時間段數據失敗:", error);
      return [];
    }
  }
  return [];
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const courseCode = formData.get("courseCode") as string;
    const schoolName = formData.get("schoolName") as string;
    const numberOfDays = Number(formData.get("numberOfDays"));
    const maxStudents = formData.get("maxStudents") ? Number(formData.get("maxStudents")) : null;
    const timeHours = Number(formData.get("timeHours"));
    const teacher = JSON.parse(formData.get("teacher") as string);
    const teacherId = formData.get("teacherId") as string;
    const isPublic = formData.get("isPublic") === "true";
    const isProduct = formData.get("isProduct") === "true";
    const type = JSON.parse(formData.get("type") as string);

    // === 關鍵修正：安全處理 courseModulId ===
    const rawCourseModulId = formData.get("courseModulId") as string | null;
    const courseModulId = rawCourseModulId && rawCourseModulId !== "null" && rawCourseModulId !== "" 
      ? rawCourseModulId 
      : undefined;

    const startDate = formData.get("startDate") as string | null;
    const endDate = formData.get("endDate") as string | null;
    const Coursedates = JSON.parse(formData.get("Coursedates") as string);
    const weekday = formData.get("weekday") as string | null;
    const classroom = formData.get("classroom") as string | null;

    // === Product 欄位 ===
    const price = formData.get("price") ? Number(formData.get("price")) : null;
    const real_price = formData.get("real_price") ? Number(formData.get("real_price")) : null;
    const Target_Audience = formData.get("Target_Audience") as string | null;
    const Course_Objective = formData.get("Course_Objective") as string | null;
    const Applicable_Scenarios = formData.get("Applicable_Scenarios") as string | null;

    const images = formData.getAll("images") as File[];
    const videos = formData.getAll("videos") as File[];

    // === 解析時間段數據 ===
    const timeRangesData = parseTimeRangesData(formData);
    console.log("解析到的時間段數據:", timeRangesData);

    // === 上傳圖片 ===
    const uploadedImages = await Promise.all(
      images.map((file) => uploadToOSS(file, `specialCourse/images`))
    );

    // === 上傳影片 ===
    const uploadedVideos = await Promise.all(
      videos.map((file) => uploadToOSS(file, `specialCourse/videos`))
    );

    // === 修正：正確處理 IMG_URL 和 Video_URL 的 JSON 數據 ===
    const imgUrlData = uploadedImages.length > 0 
      ? { images: uploadedImages } 
      : undefined;

    const videoUrlData = uploadedVideos.length > 0 
      ? { videos: uploadedVideos } 
      : undefined;

    // 使用事務創建課程和時間段
    const result = await db.$transaction(async (tx) => {
      // 創建特殊課程
      const newCourse = await tx.specialCourse.create({
        data: {
          title,
          description,
          courseCode,
          schoolName,
          numberOfDays,
          maxStudents,
          timeHours,
          teacher,
          teacherId,
          isPublic,
          isProduct,
          type,
          courseModulId,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          Coursedates: Coursedates.map((d: string) => new Date(d)),
          weekday,
          classroom,
          price,
          real_price,
          Target_Audience,
          Course_Objective,
          Applicable_Scenarios,
          IMG_URL: imgUrlData, // 改為 JSON 對象
          Video_URL: videoUrlData, // 改為 JSON 對象
        },
      });

      // 創建時間段
      if (timeRangesData.length > 0) {
        await tx.specialCourseTimeRange.createMany({
          data: timeRangesData.map((tr: any) => ({
            courseId: newCourse.id,
            timeRange: tr.timeRange,
            starttime: tr.starttime,
            endtime: tr.endtime,
          })),
        });
      }

      // 如果有上傳圖片，創建 Product_Img 記錄
      // 注意：根據您的 Prisma schema，specialCourse 和 Product 是不同的模型
      // 您需要確定如何關聯它們，或者可能需要創建 Product 記錄
      if (uploadedImages.length > 0) {
        // 這裡需要根據您的業務邏輯調整
        // 可能需要先創建 Product，然後再關聯圖片
        console.log("上傳的圖片:", uploadedImages);
      }

      // 如果有上傳影片，創建 Product_video 記錄
      if (uploadedVideos.length > 0) {
        // 同樣需要根據業務邏輯調整
        console.log("上傳的影片:", uploadedVideos);
      }

      // 返回包含時間段的完整課程數據
      return await tx.specialCourse.findUnique({
        where: { id: newCourse.id },
        include: {
          SpecialCourseTimeRanges: true,
        },
      });
    });

    console.log("創建的特殊課程:", result);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Create SpecialCourse error:", error);
    if (error.code === 'P2003') {
      return NextResponse.json({ error: "無效的 courseModulId，請檢查課程模組是否存在" }, { status: 400 });
    }
    return NextResponse.json({ error: "創建失敗: " + error.message }, { status: 500 });
  }
}