// // app/actions/Create/Create_SpecialCourseProduct/index.ts
// "use server";

// import { db } from "@/lib/db";
// import { CreateProductFromSpecialSchema } from "./schema";
// import { InputType, ReturnType } from "./types";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import OSS from "ali-oss";
// import { randomUUID } from "crypto";

// const ossClient = new OSS({
//   region: process.env.OSS_REGION!,
//   accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
//   accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
//   bucket: process.env.OSS_BUCKET!,
//   endpoint: process.env.OSS_ENDPOINT,
// });

// const isValidImage = (blob: Blob) => {
//   return blob.type.startsWith("image/") && blob.size <= 5 * 1024 * 1024;
// };

// const isValidVideo = (blob: Blob) => {
//   return blob.type.startsWith("video/") && blob.size <= 50 * 1024 * 1024;
// };

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const {
//     title,
//     description,
//     price,
//     real_price,
//     CourseProductTypeArray,
//     CourseProductStatusArray,
//     courseId,
//     images,
//     videos,
//     Target_Audience,
//     Course_Objective,
//     Applicable_Scenarios,
//   } = data;

//   // === 基礎驗證 ===
//   if (typeof price !== "number" || price < 0) {
//     return { error: "價格必須是有效的非負數字" };
//   }
//   if (typeof real_price !== "number" || real_price < 0) {
//     return { error: "實際價格必須是有效的非負數字" };
//   }

//   // === 檔案驗證（使用 Blob）===
//   if (images && !Array.isArray(images)) {
//     return { error: "圖片必須是一個陣列" };
//   }
//   if (videos && !Array.isArray(videos)) {
//     return { error: "影片必須是一個陣列" };
//   }

//   if (images) {
//     for (const img of images) {
//       if (!(img instanceof Blob) || !isValidImage(img)) {
//         return { error: "每張圖片需為 image/* 格式且不大於 5MB" };
//       }
//     }
//   }

//   if (videos) {
//     for (const vid of videos) {
//       if (!(vid instanceof Blob) || !isValidVideo(vid)) {
//         return { error: "每個影片需為 video/* 格式且不大於 50MB" };
//       }
//     }
//   }

//   // === courseId 驗證 ===
//   if (courseId) {
//     const course = await db.course.findUnique({ where: { id: courseId } });
//     if (!course) return { error: "指定的課程不存在" };
//   }

//   try {
//     const result = await db.$transaction(async (tx) => {
//       const product = await tx.product.create({
//         data: {
//           title,
//           description,
//           price,
//           real_price,
//           IsPublic: false,
//           CourseProductTypeArray: [],
//           CourseProductStatusArray: [],
//           Target_Audience: Target_Audience ?? null,
//           Course_Objective: Course_Objective ?? null,
//           Applicable_Scenarios: Applicable_Scenarios ?? null,
//           courseId: courseId ?? null,
//         },
//       });

//       // === 上傳圖片 ===
//       if (images && images.length > 0) {
//         const uploadImgPromises = images.map(async (blob: Blob) => {
//           const arrayBuffer = await blob.arrayBuffer();
//           const buffer = Buffer.from(arrayBuffer);
//           const fileName = `product/${product.id}/images/${randomUUID()}-${Date.now()}.jpg`;
          
//           const result = await ossClient.put(fileName, buffer);
          
//           return tx.product_Img.create({
//             data: {
//               img_url: result.url,
//               ProductId: product.id,
//             },
//           });
//         });

//         await Promise.all(uploadImgPromises);
//       }

//       // === 上傳影片 ===
//       if (videos && videos.length > 0) {
//         const uploadVideoPromises = videos.map(async (blob: Blob) => {
//           const arrayBuffer = await blob.arrayBuffer();
//           const buffer = Buffer.from(arrayBuffer);
//           const fileName = `product/${product.id}/videos/${randomUUID()}-${Date.now()}.mp4`;
          
//           const result = await ossClient.put(fileName, buffer);
          
//           return tx.product_video.create({
//             data: {
//               video_url: result.url,
//               ProductId: product.id,
//             },
//           });
//         });

//         await Promise.all(uploadVideoPromises);
//       }

//       // === 關聯 CourseProductType / Status ===
//       if (CourseProductTypeArray && CourseProductTypeArray.length > 0) {
//         for (const typeId of CourseProductTypeArray) {
//           await tx.courseProductType.update({
//             where: { id: typeId },
//             data: { Product: { connect: { id: product.id } } },
//           });
//         }
//       }

//       if (CourseProductStatusArray && CourseProductStatusArray.length > 0) {
//         for (const statusId of CourseProductStatusArray) {
//           await tx.courseProductStatus.update({
//             where: { id: statusId },
//             data: { Product: { connect: { id: product.id } } },
//           });
//         }
//       }

//       // === 標記 Course.Producted = true ===
//       if (courseId) {
//         await tx.course.update({
//           where: { id: courseId },
//           data: { Producted: true },
//         });
//       }

//       return await tx.product.findUnique({
//         where: { id: product.id },
//         include: {
//           Product_Img: true,
//           Product_video: true,
//           CourseProductType: true,
//           CourseProductStatus: true,
//           Course: true,
//         },
//       });
//     });

//     return { data: result! };
//   } catch (error) {
//     console.error("CreateProductAction Error:", error);
//     return {
//       error: error instanceof Error ? error.message : "建立產品失敗",
//     };
//   }
// };

// export const CreateSpecialCourseProductAction = CreateSafeAction(
//   CreateProductFromSpecialSchema,
//   handler
// );



// app/actions/Create/Create_SpecialCourseProduct/index.ts
"use server";

import { db } from "@/lib/db";
import { CreateProductFromSpecialSchema } from "./schema";
import { CreateSafeAction } from "@/lib/create-safe-action";
import OSS from "ali-oss";
import { randomUUID } from "crypto";
import z from "zod";

const ossClient = new OSS({
  region: process.env.OSS_REGION!,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
  bucket: process.env.OSS_BUCKET!,
  endpoint: process.env.OSS_ENDPOINT,
});

const handler = async (formData: FormData) => {
  // === 解析表單欄位 ===
  const raw = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    price: Number(formData.get("price")),
    real_price: Number(formData.get("real_price")),
    courseId: (formData.get("courseId") as string) || undefined,
    Target_Audience: (formData.get("Target_Audience") as string) || undefined,
    Course_Objective: (formData.get("Course_Objective") as string) || undefined,
    Applicable_Scenarios: (formData.get("Applicable_Scenarios") as string) || undefined,
    CourseProductTypeArray: formData.getAll("CourseProductTypeArray") as string[],
    CourseProductStatusArray: formData.getAll("CourseProductStatusArray") as string[],
    images: formData.getAll("images") as File[],
    videos: formData.getAll("videos") as File[],
  };

  // === Zod 驗證（不含檔案）===
  const parsed = CreateProductFromSpecialSchema.safeParse({
    title: raw.title,
    description: raw.description,
    price: raw.price,
    real_price: raw.real_price,
    courseId: raw.courseId,
    Target_Audience: raw.Target_Audience,
    Course_Objective: raw.Course_Objective,
    Applicable_Scenarios: raw.Applicable_Scenarios,
    CourseProductTypeArray: raw.CourseProductTypeArray,
    CourseProductStatusArray: raw.CourseProductStatusArray,
  });

if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const data = parsed.data;

  // === 新增：驗證 courseId 是否存在 ===
  if (data.courseId) {
    const courseExists = await db.course.findUnique({
      where: { id: data.courseId },
      select: { id: true },

      
    });
 console.log("courseExists :" , courseExists , "-- End --")
    if (!courseExists) {
      return { error: "指定的課程不存在，請重新選擇" };
    }
  }

 

  // === 檔案驗證（Server 端）===
  const images = raw.images.filter((f): f is File => f instanceof File && f.size > 0);
  const videos = raw.videos.filter((f): f is File => f instanceof File && f.size > 0);

  for (const img of images) {
    if (!img.type.startsWith("image/") || img.size > 5 * 1024 * 1024) {
      return { error: "每張圖片需為 image/* 且不大於 5MB" };
    }
  }
  for (const vid of videos) {
    if (!vid.type.startsWith("video/") || vid.size > 50 * 1024 * 1024) {
      return { error: "每個影片需為 video/* 且不大於 50MB" };
    }
  }

  // === 資料庫交易 ===
  try {
    const result = await db.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          title: data.title,
          description: data.description,
          price: data.price,
          real_price: data.real_price,
          IsPublic: false,
          Target_Audience: data.Target_Audience ?? null,
          Course_Objective: data.Course_Objective ?? null,
          Applicable_Scenarios: data.Applicable_Scenarios ?? null,
          courseId: data.courseId ?? null,
        },
      });

      // 上傳圖片
      if (images.length > 0) {
        const uploadPromises = images.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          const fileName = `product/${product.id}/images/${randomUUID()}-${file.name}`;
          const result = await ossClient.put(fileName, buffer);
          return tx.product_Img.create({
            data: { img_url: result.url, ProductId: product.id },
          });
        });
        await Promise.all(uploadPromises);
      }

      // 上傳影片
      if (videos.length > 0) {
        const uploadPromises = videos.map(async (file) => {
          const buffer = Buffer.from(await file.arrayBuffer());
          const fileName = `product/${product.id}/videos/${randomUUID()}-${file.name}`;
          const result = await ossClient.put(fileName, buffer);
          return tx.product_video.create({
            data: { video_url: result.url, ProductId: product.id },
          });
        });
        await Promise.all(uploadPromises);
      }

      // 關聯類型與狀態
      if (data.CourseProductTypeArray) {
        for (const id of data.CourseProductTypeArray) {
          await tx.courseProductType.update({
            where: { id },
            data: { Product: { connect: { id: product.id } } },
          });
        }
      }
      if (data.CourseProductStatusArray) {
        for (const id of data.CourseProductStatusArray) {
          await tx.courseProductStatus.update({
            where: { id },
            data: { Product: { connect: { id: product.id } } },
          });
        }
      }

      if (data.courseId) {
        await tx.course.update({
          where: { id: data.courseId },
          data: { Producted: true },
        });
      }

      return await tx.product.findUnique({
        where: { id: product.id },
        include: { Product_Img: true, Product_video: true },
      });
    });

    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: "建立產品失敗" };
  }
};

export const CreateSpecialCourseProductAction = CreateSafeAction(
  // 改用 z.instanceof(FormData)
  z.instanceof(FormData),
  handler
);