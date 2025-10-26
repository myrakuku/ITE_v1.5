// "use server";

// import { db } from "@/lib/db";
// import { CreateProductSchema } from "./schema";
// import { InputType, ReturnType } from "./types";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import OSS from "ali-oss";
// import { randomUUID } from "crypto";

// const ossClient = new OSS({
//   region: process.env.OSS_REGION,
//   accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
//   accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
//   bucket: process.env.OSS_BUCKET,
//   endpoint: process.env.OSS_ENDPOINT,
// });

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const {
//     title,
//     description,
//     price,
//     real_price,
//     IsPublic,
//     CourseProductTypeArray,
//     CourseProductStatusArray,
//     courseId,
//     images,
//     videos,
//     Target_Audience,
//     Course_Objective,
//     Applicable_Scenarios,
//   } = data;

//   console.log("-- Input CourseProductTypeArray -- :", CourseProductTypeArray);
//   console.log("-- Input images -- :", images?.map((img: any) => img.name));
//   console.log("-- Input videos -- :", videos?.map((vid: any) => vid.name));

//   // 驗證 price
//   if (typeof price !== "number" || isNaN(price) || price < 0) {
//     return { error: "價格必須是有效的非負數字" };
//   }

//   // 驗證 images
//   if (images && !Array.isArray(images)) {
//     return { error: "圖片必須是一個陣列" };
//   }
//   if (images) {
//     for (const image of images) {
//       if (!image || typeof image !== "object" || !image.name || !image.type || !image.size) {
//         return { error: "無效的圖片格式" };
//       }
//       if (image.size > 5 * 1024 * 1024) {
//         return { error: "圖片大小不能超過 5MB" };
//       }
//       if (!image.type.startsWith("image/")) {
//         return { error: "僅支援圖片格式" };
//       }
//     }
//   }

//   // 驗證 videos
//   if (videos && !Array.isArray(videos)) {
//     return { error: "影片必須是一個陣列" };
//   }
//   if (videos) {
//     for (const video of videos) {
//       if (!video || typeof video !== "object" || !video.name || !video.type || !video.size) {
//         return { error: "無效的影片格式" };
//       }
//       if (video.size > 50 * 1024 * 1024) {
//         return { error: "影片大小不能超過 50MB" };
//       }
//       if (!video.type.startsWith("video/")) {
//         return { error: "僅支援影片格式" };
//       }
//     }
//   }

//   // 驗證 courseId
//   if (courseId) {
//     const courseExists = await db.course.findUnique({
//       where: { id: courseId },
//     });
//     if (!courseExists) {
//       return { error: "無效的課程 ID，課程不存在" };
//     }
//   }

//   try {
//     // 開始事務
//     const product_data = await db.$transaction(async (tx) => {
//       // 創建產品，顯式處理 null 值
//       const product = await tx.product.create({
//         data: {
//           title,
//           description,
//           price,
//           real_price,
//           IsPublic,
//           CourseProductTypeArray,
//           CourseProductStatusArray,
//           courseId,
//           Target_Audience: Target_Audience ?? null, // 將 undefined 轉為 null
//           Course_Objective: Course_Objective ?? null, // 將 undefined 轉為 null
//           Applicable_Scenarios: Applicable_Scenarios ?? null, // 將 undefined 轉為 null
//         },
//       });

//       // 處理圖片上傳
//       if (images && images.length > 0) {
//         const imageUrls = await Promise.all(
//           images.map(async (image: any) => {
//             const fileName = `${randomUUID()}-${image.name}`;
//             const buffer = Buffer.from(await image.arrayBuffer());
//             const result = await ossClient.put(`products/images/${fileName}`, buffer);
//             return result.url;
//           })
//         );

//         await tx.product_Img.createMany({
//           data: imageUrls.map((url) => ({
//             img_url: url,
//             ProductId: product.id,
//           })),
//         });
//       }

//       // 處理影片上傳
//       if (videos && videos.length > 0) {
//         const videoUrls = await Promise.all(
//           videos.map(async (video: any) => {
//             const fileName = `${randomUUID()}-${video.name}`;
//             const buffer = Buffer.from(await video.arrayBuffer());
//             const result = await ossClient.put(`products/videos/${fileName}`, buffer);
//             return result.url;
//           })
//         );

//         await tx.product_video.createMany({
//           data: videoUrls.map((url) => ({
//             video_url: url,
//             ProductId: product.id,
//           })),
//         });
//       }

//       // 更新課程 Producted 字段
//       if (courseId) {
//         await tx.course.update({
//           where: { id: courseId },
//           data: { Producted: true },
//         });
//       }

//       return product;
//     });

//     console.log("-- Create Product on server -- :", product_data, "-- End --");

//     return {
//       data: product_data,
//     };
//   } catch (error) {
//     console.error("-- Error -- :", error, "-- End --");
//     return { error: error instanceof Error ? error.message : "未知錯誤" };
//   }
// };

// export const CreateProductAction = CreateSafeAction(CreateProductSchema, handler);

"use server";

import { db } from "@/lib/db";
import { CreateSpecialCourseProductSchema } from "./schema";
import { InputType, ReturnType } from "./types";
import { CreateSafeAction } from "@/lib/create-safe-action";
import OSS from "ali-oss";
import { randomUUID } from "crypto";

const ossClient = new OSS({
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
  bucket: process.env.OSS_BUCKET,
  endpoint: process.env.OSS_ENDPOINT,
});

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    title,
    description,
    price,
    real_price,
    IsPublic,
    CourseProductTypeArray,
    CourseProductStatusArray,
    courseId,
    images,
    videos,
    Target_Audience,
    Course_Objective,
    Applicable_Scenarios,
  } = data;

  console.log("-- Input CourseProductTypeArray -- :", CourseProductTypeArray);
  console.log("-- Input images -- :", images?.map((img: File) => img.name));
  console.log("-- Input videos -- :", videos?.map((vid: File) => vid.name));

  // 驗證 price
  if (typeof price !== "number" || isNaN(price) || price < 0) {
    return { error: "價格必須是有效的非負數字" };
  }

  // 驗證 images
  if (images && !Array.isArray(images)) {
    return { error: "圖片必須是一個陣列" };
  }
  if (images) {
    for (const image of images) {
      if (!image || !(image instanceof File) || !image.name || !image.type || !image.size) {
        return { error: "無效的圖片格式" };
      }
      if (image.size > 5 * 1024 * 1024) {
        return { error: "圖片大小不能超過 5MB" };
      }
      if (!image.type.startsWith("image/")) {
        return { error: "僅支援圖片格式" };
      }
    }
  }

  // 驗證 videos
  if (videos && !Array.isArray(videos)) {
    return { error: "影片必須是一個陣列" };
  }
  if (videos) {
    for (const video of videos) {
      if (!video || !(video instanceof File) || !video.name || !video.type || !video.size) {
        return { error: "無效的影片格式" };
      }
      if (video.size > 50 * 1024 * 1024) {
        return { error: "影片大小不能超過 50MB" };
      }
      if (!video.type.startsWith("video/")) {
        return { error: "僅支援影片格式" };
      }
    }
  }

  // 驗證 courseId
  if (courseId) {
    const courseExists = await db.course.findUnique({
      where: { id: courseId },
    });
    if (!courseExists) {
      return { error: "無效的課程 ID，課程不存在" };
    }
  }

  try {
    // 開始事務
    const product_data = await db.$transaction(async (tx) => {
      // 創建產品，顯式處理 null 值
      const product = await tx.product.create({
        data: {
          title,
          description,
          price,
          real_price,
          IsPublic,
          CourseProductTypeArray,
          CourseProductStatusArray,
          courseId,
          Target_Audience: Target_Audience ?? null,
          Course_Objective: Course_Objective ?? null,
          Applicable_Scenarios: Applicable_Scenarios ?? null,
        },
      });

      // 處理圖片上傳
      if (images && images.length > 0) {
        const imageUrls = await Promise.all(
          images.map(async (image: File) => {
            const fileName = `${randomUUID()}-${image.name}`;
            const buffer = Buffer.from(await image.arrayBuffer());
            const result = await ossClient.put(`products/images/${fileName}`, buffer);
            return result.url;
          })
        );

        await tx.product_Img.createMany({
          data: imageUrls.map((url) => ({
            img_url: url,
            ProductId: product.id,
          })),
        });
      }

      // 處理影片上傳
      if (videos && videos.length > 0) {
        const videoUrls = await Promise.all(
          videos.map(async (video: File) => {
            const fileName = `${randomUUID()}-${video.name}`;
            const buffer = Buffer.from(await video.arrayBuffer());
            const result = await ossClient.put(`products/videos/${fileName}`, buffer);
            return result.url;
          })
        );

        await tx.product_video.createMany({
          data: videoUrls.map((url) => ({
            video_url: url,
            ProductId: product.id,
          })),
        });
      }

      // 更新課程 Producted 欄位
      if (courseId) {
        await tx.course.update({
          where: { id: courseId },
          data: { Producted: true },
        });
      }

      return product;
    });

    console.log("-- Create Product on server -- :", product_data, "-- End --");

    return {
      data: product_data,
    };
  } catch (error) {
    console.error("-- Error -- :", error, "-- End --");
    return { error: error instanceof Error ? error.message : "未知錯誤" };
  }
};

export const CreateSpecialCourseProductAction = CreateSafeAction(CreateSpecialCourseProductSchema, handler);