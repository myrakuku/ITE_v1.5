// "use server";

// import { db } from "@/lib/db";
// import { CreateProductSchema, InputType, OutputType } from "./schema";
// import { CreateSafeAction, ActionState } from "@/lib/create-safe-action";
// import OSS from "ali-oss";
// import { randomUUID } from "crypto";

// const ossClient = new OSS({
//   region: process.env.OSS_REGION,
//   accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
//   accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
//   bucket: process.env.OSS_BUCKET,
//   endpoint: process.env.OSS_ENDPOINT,
// });

// async function parseFormData(formData: FormData): Promise<InputType> {
//   const title = formData.get("title") as string;
//   const description = formData.get("description") as string;
//   const price = Number(formData.get("price"));
//   const real_price = Number(formData.get("real_price"));
//   const IsPublic = formData.get("IsPublic") === "true";
//   const CourseProductTypeArray = JSON.parse(formData.get("CourseProductTypeArray") as string || "[]") as string[];
//   const CourseProductStatusArray = JSON.parse(formData.get("CourseProductStatusArray") as string || "[]") as string[];
//   const courseId = formData.get("courseId") as string | undefined;
//   const Target_Audience = formData.get("Target_Audience") as string | undefined;
//   const Course_Objective = formData.get("Course_Objective") as string | undefined;
//   const Applicable_Scenarios = formData.get("Applicable_Scenarios") as string | undefined;
//   const courseDates = JSON.parse(formData.get("courseDates") as string || "[]") as string[];
//   const courseTimeRanges = JSON.parse(formData.get("courseTimeRanges") as string || "[]") as {
//     timeRange: string;
//     startTime?: string | null;
//     endTime?: string | null;
//   }[];
//   const videoUrls = formData.get("videoUrls") as string | undefined;

//   // 改進圖片解析邏輯 - 適用於 Server Components
//   const images: { file: File; name: string; type: string; size: number }[] = [];

//   // 在 Server Components 中，我們需要這樣處理文件
//   const imageFiles = formData.getAll("images");
  
//   console.log(`從 FormData 獲取到 ${imageFiles.length} 個文件`);
  
//   for (const file of imageFiles) {
//     // 在 Server Components 中，我們需要這樣檢查文件
//     if (file && typeof file === 'object' && 'name' in file && 'size' in file && 'type' in file) {
//       const fileObj = file as any;
//       console.log(`找到有效圖片: ${fileObj.name} (${fileObj.size} bytes, ${fileObj.type})`);
//       images.push({
//         file: file as File,
//         name: fileObj.name,
//         type: fileObj.type,
//         size: fileObj.size
//       });
//     }
//   }

//   console.log(`解析到 ${images.length} 張有效圖片`);

//   // 圖片驗證
//   if (images.length > 0) {
//     for (const image of images) {
//       if (!image.name || !image.type || image.size === 0) {
//         throw new Error("無效的圖片格式");
//       }
//       if (image.size > 5 * 1024 * 1024) {
//         throw new Error(`圖片 ${image.name} 大小不能超過 5MB`);
//       }
//       if (!image.type.startsWith("image/")) {
//         throw new Error(`檔案 ${image.name} 不是圖片格式`);
//       }
//     }
//   }

//   // 上傳圖片到 OSS
//   let imageUrls: string[] = [];
//   if (images.length > 0) {
//     console.log("開始上傳圖片到 OSS...");
//     try {
//       imageUrls = await Promise.all(
//         images.map(async (image) => {
//           const fileName = `${randomUUID()}-${image.name.replace(/\s+/g, '_')}`;
          
//           // 在 Server Components 中，我們需要這樣讀取文件內容
//           const arrayBuffer = await image.file.arrayBuffer();
//           const buffer = Buffer.from(arrayBuffer);
          
//           console.log(`上傳圖片: ${image.name} -> ${fileName}`);
          
//           const result = await ossClient.put(`products/images/${fileName}`, buffer, {
//             headers: {
//               'Content-Type': image.type,
//             }
//           });
          
//           if (!result.url) {
//             throw new Error("OSS 上傳失敗，未返回 URL");
//           }
          
//           console.log(`圖片上傳成功: ${result.url}`);
//           return result.url;
//         })
//       );
//       console.log(`所有圖片上傳完成，共 ${imageUrls.length} 張`);
//     } catch (ossError) {
//       console.error("OSS 上傳錯誤:", ossError);
//       throw new Error(`圖片上傳到 OSS 失敗: ${ossError instanceof Error ? ossError.message : '未知錯誤'}`);
//     }
//   }

//   return {
//     title,
//     description,
//     price,
//     real_price,
//     IsPublic,
//     CourseProductTypeArray: CourseProductTypeArray.length > 0 ? CourseProductTypeArray : undefined,
//     CourseProductStatusArray: CourseProductStatusArray.length > 0 ? CourseProductStatusArray : undefined,
//     courseId: courseId || null,
//     imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
//     videoUrls: videoUrls || undefined,
//     Target_Audience: Target_Audience || null,
//     Course_Objective: Course_Objective || null,
//     Applicable_Scenarios: Applicable_Scenarios || null,
//     courseDates: courseDates.length > 0 ? courseDates : undefined,
//     courseTimeRanges: courseTimeRanges.length > 0 ? courseTimeRanges : undefined,
//   };
// }

// // 主要的 Server Action
// export const CreateProductAction = async (
//   formData: FormData
// ): Promise<ActionState<InputType, OutputType>> => {
//   try {
//     // 添加調試信息來檢查 FormData 內容
//     console.log("收到 FormData，鍵名列表:");
//     for (let [key, value] of formData.entries()) {
//       if (value && typeof value === 'object' && 'name' in value) {
//         const fileInfo = value as any;
//         console.log(`${key}: File - ${fileInfo.name} (${fileInfo.size} bytes, ${fileInfo.type})`);
//       } else {
//         console.log(`${key}: ${value}`);
//       }
//     }

//     const parsedData = await parseFormData(formData);

//     console.log("後端解析後的數據:", parsedData);

//     // 創建安全的 action 處理器
//     const handler = async (validatedData: InputType): Promise<ActionState<InputType, OutputType>> => {
//       try {
//         const {
//           title,
//           description,
//           price,
//           real_price,
//           IsPublic,
//           CourseProductTypeArray,
//           CourseProductStatusArray,
//           courseId,
//           imageUrls,
//           videoUrls,
//           Target_Audience,
//           Course_Objective,
//           Applicable_Scenarios,
//           courseDates,
//           courseTimeRanges,
//         } = validatedData;

//         if (courseId) {
//           const courseExists = await db.course.findUnique({
//             where: { id: courseId },
//           });
//           if (!courseExists) {
//             return { error: "無效的課程 ID，課程不存在" };
//           }
//         }

//         console.log("驗證後的數據:", validatedData);

//         const product = await db.$transaction(async (tx) => {
//           const newProduct = await tx.product.create({
//             data: {
//               title,
//               description,
//               price,
//               real_price,
//               IsPublic,
//               CourseProductTypeArray: CourseProductTypeArray || [],
//               CourseProductStatusArray: CourseProductStatusArray || [],
//               courseId: courseId || undefined,
//               Target_Audience: Target_Audience || null,
//               Course_Objective: Course_Objective || null,
//               Applicable_Scenarios: Applicable_Scenarios || null,
//             },
//           });

//           if (imageUrls && imageUrls.length > 0) {
//             await tx.product_Img.createMany({
//               data: imageUrls.map((url) => ({
//                 img_url: url,
//                 ProductId: newProduct.id,
//               })),
//             });
//           }

//           if (videoUrls) {
//             await tx.product_video.create({
//               data: {
//                 video_url: videoUrls,
//                 ProductId: newProduct.id,
//               },
//             });
//           }

//           if (courseDates && courseDates.length > 0) {
//             await tx.product_Course_Dates.createMany({
//               data: courseDates.map((date) => ({
//                 date: new Date(date),
//                 ProductId: newProduct.id,
//               })),
//             });
//           }

//           if (courseTimeRanges && courseTimeRanges.length > 0) {
//             await tx.product_Course_Time_Ranges.createMany({
//               data: courseTimeRanges.map((range) => ({
//                 timeRange: range.timeRange,
//                 starttime: range.startTime,
//                 endtime: range.endTime,
//                 ProductId: newProduct.id,
//               })),
//             });
//           }

//           if (courseId) {
//             await tx.course.update({
//               where: { id: courseId },
//               data: { Producted: true },
//             });
//           }

//           // 獲取完整的產品資料
//           return await tx.product.findUnique({
//             where: { id: newProduct.id },
//             include: {
//               Product_Img: true,
//               Product_video: true,
//               Product_Course_Dates: true,
//               Product_Course_Time_Ranges: true,
//             },
//           });
//         });

//         if (!product) {
//           return { error: "產品創建失敗" };
//         }

//         // 構建符合 OutputType 的返回數據
//         const returnData: OutputType = {
//           id: product.id,
//           title: product.title,
//           description: product.description,
//           price: product.price,
//           real_price: product.real_price,
//           IsPublic: product.IsPublic,
//           CourseProductTypeArray: product.CourseProductTypeArray,
//           CourseProductStatusArray: product.CourseProductStatusArray,
//           courseId: product.courseId,
//           imageUrls: product.Product_Img?.map((img) => img.img_url) || [],
//           videoUrls: product.Product_video?.[0]?.video_url || undefined,
//           Target_Audience: product.Target_Audience,
//           Course_Objective: product.Course_Objective,
//           Applicable_Scenarios: product.Applicable_Scenarios,
//           courseDates: product.Product_Course_Dates?.map(date => date.date.toISOString()) || [],
//           courseTimeRanges: product.Product_Course_Time_Ranges?.map(range => ({
//             timeRange: range.timeRange,
//             startTime: range.starttime,
//             endTime: range.endtime,
//           })) || [],
//           createdAt: product.createdAt.toISOString(),
//           updatedAt: product.updatedAt.toISOString(),
//         };

//         return { data: returnData };
//       } catch (error) {
//         console.error("-- Error in handler -- :", error);
//         return {
//           error: error instanceof Error ? error.message : "未知錯誤",
//         };
//       }
//     };

//     // 使用 CreateSafeAction 進行驗證和處理
//     const safeAction = CreateSafeAction(CreateProductSchema, handler);
//     return await safeAction(parsedData);

//   } catch (error) {
//     console.error("-- Error in parseFormData -- :", error);
//     return {
//       error: error instanceof Error ? error.message : "無法解析表單數據",
//     };
//   }
// };

"use server";

import { db } from "@/lib/db";
import { CreateProductSchema, InputType, OutputType } from "./schema";
import { CreateSafeAction, ActionState } from "@/lib/create-safe-action";
import OSS from "ali-oss";
import { randomUUID } from "crypto";

const ossClient = new OSS({
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
  bucket: process.env.OSS_BUCKET,
  endpoint: process.env.OSS_ENDPOINT,
});

// 使用原生 File 類型的類型守衛函數
function isFile(value: FormDataEntryValue): value is File {
  if (!value || typeof value !== 'object') {
    return false;
  }
  
  const file = value as File;
  return (
    typeof file.name === 'string' &&
    typeof file.size === 'number' &&
    typeof file.type === 'string' &&
    'arrayBuffer' in file &&
    typeof file.arrayBuffer === 'function'
  );
}

async function parseFormData(formData: FormData): Promise<InputType> {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const real_price = Number(formData.get("real_price"));
  const IsPublic = formData.get("IsPublic") === "true";
  const CourseProductTypeArray = JSON.parse(formData.get("CourseProductTypeArray") as string || "[]") as string[];
  const CourseProductStatusArray = JSON.parse(formData.get("CourseProductStatusArray") as string || "[]") as string[];
  const courseId = formData.get("courseId") as string | undefined;
  const Target_Audience = formData.get("Target_Audience") as string | undefined;
  const Course_Objective = formData.get("Course_Objective") as string | undefined;
  const Applicable_Scenarios = formData.get("Applicable_Scenarios") as string | undefined;
  const courseDates = JSON.parse(formData.get("courseDates") as string || "[]") as string[];
  const courseTimeRanges = JSON.parse(formData.get("courseTimeRanges") as string || "[]") as {
    timeRange: string;
    startTime?: string | null;
    endTime?: string | null;
  }[];
  const videoUrls = formData.get("videoUrls") as string | undefined;

  // 改進圖片解析邏輯
  const images: { file: File; name: string; type: string; size: number }[] = [];
  const imageFiles = formData.getAll("images");

  console.log(`從 FormData 獲取到 ${imageFiles.length} 個文件`);

  for (const file of imageFiles) {
    if (isFile(file)) {
      console.log(`找到有效圖片: ${file.name} (${file.size} bytes, ${file.type})`);
      images.push({
        file,
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }
  }

  console.log(`解析到 ${images.length} 張有效圖片`);

  // 圖片驗證
  if (images.length > 0) {
    for (const image of images) {
      if (!image.name || !image.type || image.size === 0) {
        throw new Error("無效的圖片格式");
      }
      if (image.size > 5 * 1024 * 1024) {
        throw new Error(`圖片 ${image.name} 大小不能超過 5MB`);
      }
      if (!image.type.startsWith("image/")) {
        throw new Error(`檔案 ${image.name} 不是圖片格式`);
      }
    }
  }

  // 上傳圖片到 OSS
  let imageUrls: string[] = [];
  if (images.length > 0) {
    console.log("開始上傳圖片到 OSS...");
    try {
      imageUrls = await Promise.all(
        images.map(async (image) => {
          const fileName = `${randomUUID()}-${image.name.replace(/\s+/g, '_')}`;
          const arrayBuffer = await image.file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          console.log(`上傳圖片: ${image.name} -> ${fileName}`);

          const result = await ossClient.put(`products/images/${fileName}`, buffer, {
            headers: {
              'Content-Type': image.type,
            },
          });

          if (!result.url) {
            throw new Error("OSS 上傳失敗，未返回 URL");
          }

          console.log(`圖片上傳成功: ${result.url}`);
          return result.url;
        })
      );
      console.log(`所有圖片上傳完成，共 ${imageUrls.length} 張`);
    } catch (ossError) {
      console.error("OSS 上傳錯誤:", ossError);
      throw new Error(`圖片上傳到 OSS 失敗: ${ossError instanceof Error ? ossError.message : '未知錯誤'}`);
    }
  }

  return {
    title,
    description,
    price,
    real_price,
    IsPublic,
    CourseProductTypeArray: CourseProductTypeArray.length > 0 ? CourseProductTypeArray : undefined,
    CourseProductStatusArray: CourseProductStatusArray.length > 0 ? CourseProductStatusArray : undefined,
    courseId: courseId || null,
    imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
    videoUrls: videoUrls || undefined,
    Target_Audience: Target_Audience || null,
    Course_Objective: Course_Objective || null,
    Applicable_Scenarios: Applicable_Scenarios || null,
    courseDates: courseDates.length > 0 ? courseDates : undefined,
    courseTimeRanges: courseTimeRanges.length > 0 ? courseTimeRanges : undefined,
  };
}

export const CreateProductAction = async (
  formData: FormData
): Promise<ActionState<OutputType>> => {
  try {
    // 添加調試信息來檢查 FormData 內容
    console.log("收到 FormData，鍵名列表:");
    for (const [key, value] of formData.entries()) {
      if (isFile(value)) {
        console.log(`${key}: File - ${value.name} (${value.size} bytes, ${value.type})`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }

    const parsedData = await parseFormData(formData);

    console.log("後端解析後的數據:", parsedData);

    // 創建安全的 action 處理器
    const handler = async (validatedData: InputType): Promise<ActionState<OutputType>> => {
      try {
        const {
          title,
          description,
          price,
          real_price,
          IsPublic,
          CourseProductTypeArray,
          CourseProductStatusArray,
          courseId,
          imageUrls,
          videoUrls,
          Target_Audience,
          Course_Objective,
          Applicable_Scenarios,
          courseDates,
          courseTimeRanges,
        } = validatedData;

        if (courseId) {
          const courseExists = await db.course.findUnique({
            where: { id: courseId },
          });
          if (!courseExists) {
            return { error: "無效的課程 ID，課程不存在" };
          }
        }

        console.log("驗證後的數據:", validatedData);

        const product = await db.$transaction(async (tx) => {
          const newProduct = await tx.product.create({
            data: {
              title,
              description,
              price,
              real_price,
              IsPublic,
              CourseProductTypeArray: CourseProductTypeArray || [],
              CourseProductStatusArray: CourseProductStatusArray || [],
              courseId: courseId || undefined,
              Target_Audience: Target_Audience || null,
              Course_Objective: Course_Objective || null,
              Applicable_Scenarios: Applicable_Scenarios || null,
            },
          });

          if (imageUrls && imageUrls.length > 0) {
            await tx.product_Img.createMany({
              data: imageUrls.map((url) => ({
                img_url: url,
                ProductId: newProduct.id,
              })),
            });
          }

          if (videoUrls) {
            await tx.product_video.create({
              data: {
                video_url: videoUrls,
                ProductId: newProduct.id,
              },
            });
          }

          if (courseDates && courseDates.length > 0) {
            await tx.product_Course_Dates.createMany({
              data: courseDates.map((date) => ({
                date: new Date(date),
                ProductId: newProduct.id,
              })),
            });
          }

          if (courseTimeRanges && courseTimeRanges.length > 0) {
            await tx.product_Course_Time_Ranges.createMany({
              data: courseTimeRanges.map((range) => ({
                timeRange: range.timeRange,
                starttime: range.startTime,
                endtime: range.endTime,
                ProductId: newProduct.id,
              })),
            });
          }

          if (courseId) {
            await tx.course.update({
              where: { id: courseId },
              data: { Producted: true },
            });
          }

          // 獲取完整的產品資料
          return await tx.product.findUnique({
            where: { id: newProduct.id },
            include: {
              Product_Img: true,
              Product_video: true,
              Product_Course_Dates: true,
              Product_Course_Time_Ranges: true,
            },
          });
        });

        if (!product) {
          return { error: "產品創建失敗" };
        }

        // 構建符合 OutputType 的返回數據
        const returnData: OutputType = {
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          real_price: product.real_price,
          IsPublic: product.IsPublic,
          CourseProductTypeArray: product.CourseProductTypeArray,
          CourseProductStatusArray: product.CourseProductStatusArray,
          courseId: product.courseId,
          imageUrls: product.Product_Img?.map((img) => img.img_url) || [],
          videoUrls: product.Product_video?.[0]?.video_url || undefined,
          Target_Audience: product.Target_Audience,
          Course_Objective: product.Course_Objective,
          Applicable_Scenarios: product.Applicable_Scenarios,
          courseDates: product.Product_Course_Dates?.map(date => date.date.toISOString()) || [],
          courseTimeRanges: product.Product_Course_Time_Ranges?.map(range => ({
            timeRange: range.timeRange,
            startTime: range.starttime,
            endTime: range.endtime,
          })) || [],
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt.toISOString(),
        };

        return { data: returnData };
      } catch (error) {
        console.error("-- Error in handler -- :", error);
        return {
          error: error instanceof Error ? error.message : "未知錯誤",
        };
      }
    };

    // 使用 CreateSafeAction 進行驗證和處理
    const safeAction = CreateSafeAction(CreateProductSchema, handler);
    return await safeAction(parsedData);

  } catch (error) {
    console.error("-- Error in parseFormData -- :", error);
    return {
      error: error instanceof Error ? error.message : "無法解析表單數據",
    };
  }
};