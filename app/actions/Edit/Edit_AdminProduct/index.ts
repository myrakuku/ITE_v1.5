// 'use server';

// import { db } from "@/lib/db";
// import { auth } from "@/auth";
// import OSS from "ali-oss";
// import { EditProductSchema } from "./schema";

// const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// export async function EditProductAction(formData: FormData) {
//   const session = await auth();
//   if (!session?.user?.id || session.user.role !== "ADMIN") {
//     return { success: false, error: "未授權：僅限管理員操作" };
//   }

//   try {
//     // 從 FormData 提取字段
//     const data = {
//       productId: formData.get("productId") as string,
//       title: formData.get("title") as string,
//       description: formData.get("description") as string,
//       price: Number(formData.get("price")),
//       real_price: Number(formData.get("real_price")),
//       IsPublic: formData.get("IsPublic") === "true",
//       CoursePorductTypeArray: JSON.parse(formData.get("CoursePorductTypeArray") as string),
//       CoursePorductStatueArray: JSON.parse(formData.get("CoursePorductStatueArray") as string),
//       video_urls: JSON.parse(formData.get("video_urls") as string),
//     };

//     // 驗證數據
//     const validatedData = EditProductSchema.parse(data);

//     // 驗證產品是否存在
//     const productExists = await db.product.findUnique({
//       where: { id: validatedData.productId },
//     });
//     if (!productExists) {
//       return { success: false, error: "產品不存在" };
//     }

//     // 處理圖片上傳
//     const images = formData.getAll("images") as File[];
//     const uploadedImageUrls: string[] = [];

//     if (images && images.length > 0) {
//       const ossClient = new OSS({
//         region: process.env.OSS_REGION,
//         accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
//         accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
//         bucket: process.env.OSS_BUCKET,
//         endpoint: process.env.OSS_ENDPOINT,
//       });
//       for (const image of images) {
//         if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
//           return { success: false, error: `無效的圖片類型：${image.name}，僅支持 JPEG、PNG、GIF` };
//         }
//         if (image.size > MAX_FILE_SIZE) {
//           return { success: false, error: `圖片 ${image.name} 大小超過 5MB` };
//         }

//         const fileName = `products/${validatedData.productId}/${Date.now()}_${image.name}`;
//         const result = await ossClient.put(fileName, Buffer.from(await image.arrayBuffer()));
//         if (result.url) {
//           uploadedImageUrls.push(result.url);
//         }
//       }

//       if (uploadedImageUrls.length > 0) {
//         await db.product_Img.createMany({
//           data: uploadedImageUrls.map((url) => ({
//             img_url: url,
//             ProductId: validatedData.productId,
//           })),
//         });
//       }
//     }

//     // 處理影片 URL
//     const videoUrls = validatedData.video_urls || [];
//     if (videoUrls.length > 0) {
//       await db.product_video.createMany({
//         data: videoUrls.map((url) => ({
//           video_url: url,
//           ProductId: validatedData.productId,
//         })),
//       });
//     }

//     // 更新 Product 表
//     const updatedProduct = await db.product.update({
//       where: { id: validatedData.productId },
//       data: {
//         title: validatedData.title,
//         description: validatedData.description,
//         price: validatedData.price,
//         real_price: validatedData.real_price,
//         IsPublic: validatedData.IsPublic,
//         CourseProductTypeArray: validatedData.CoursePorductTypeArray,
//         CourseProductStatusArray: validatedData.CoursePorductStatueArray,
//       },
//     });

//     return {
//       success: true,
//       product: {
//         productId: updatedProduct.id,
//         title: updatedProduct.title,
//         description: updatedProduct.description,
//         price: updatedProduct.price,
//         real_price: updatedProduct.real_price,
//         IsPublic: updatedProduct.IsPublic,
//         CoursePorductTypeArray: updatedProduct.CourseProductTypeArray,
//         CoursePorductStatueArray: updatedProduct.CourseProductStatusArray,
//       },
//     };
//   } catch (err) {
//     return { success: false, error: err instanceof Error ? err.message : "更新產品失敗" };
//   }
// }
// // app/actions/Edit/Edit_AdminProduct/index.ts
'use server';

import { db } from "@/lib/db";
import { auth } from "@/auth";
import OSS from "ali-oss";
import { EditProductSchema } from "./schema";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// 手動驗證 File 物件
function isFile(obj: any): obj is File {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "name" in obj &&
    "size" in obj &&
    "type" in obj &&
    typeof obj.arrayBuffer === "function"
  );
}

export async function EditProductAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { success: false, error: "未授權：僅限管理員操作" };
  }

  try {
    // 提取基礎欄位
    const rawData = {
      productId: formData.get("productId") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: Number(formData.get("price")),
      real_price: Number(formData.get("real_price")),
      IsPublic: formData.get("IsPublic") === "true",
      CoursePorductTypeArray: JSON.parse(formData.get("CoursePorductTypeArray") as string || "[]"),
      CoursePorductStatueArray: JSON.parse(formData.get("CoursePorductStatueArray") as string || "[]"),
      video_urls: JSON.parse(formData.get("video_urls") as string || "[]"),
      images: formData.getAll("images"), // 保持原始 File[]
    };

    // Zod 驗證（不檢查 File 類型）
    const validatedData = EditProductSchema.parse(rawData);

    // 手動驗證 images 是否為 File[]
    const images = validatedData.images;
    if (images && images.length > 0) {
      if (!images.every(isFile)) {
        return { success: false, error: "上傳的檔案格式不正確" };
      }
    }

    // 驗證產品是否存在
    const productExists = await db.product.findUnique({
      where: { id: validatedData.productId },
    });
    if (!productExists) {
      return { success: false, error: "產品不存在" };
    }

    // 上傳圖片
    const uploadedImageUrls: string[] = [];
    if (images && images.length > 0) {
      const ossClient = new OSS({
        region: process.env.OSS_REGION!,
        accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
        accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
        bucket: process.env.OSS_BUCKET!,
        endpoint: process.env.OSS_ENDPOINT,
      });

      for (const image of images as File[]) {
        if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
          return { success: false, error: `無效的圖片類型：${image.name}` };
        }
        if (image.size > MAX_FILE_SIZE) {
          return { success: false, error: `圖片 ${image.name} 超過 5MB` };
        }

        const fileName = `products/${validatedData.productId}/${Date.now()}_${image.name}`;
        const buffer = Buffer.from(await image.arrayBuffer());
        const result = await ossClient.put(fileName, buffer);
        if (result.url) {
          uploadedImageUrls.push(result.url);
        }
      }

      if (uploadedImageUrls.length > 0) {
        await db.product_Img.createMany({
          data: uploadedImageUrls.map((url) => ({
            img_url: url,
            ProductId: validatedData.productId,
          })),
        });
      }
    }

    // 處理影片
    const videoUrls = validatedData.video_urls || [];
    if (videoUrls.length > 0) {
      await db.product_video.createMany({
        data: videoUrls.map((url) => ({
          video_url: url,
          ProductId: validatedData.productId,
        })),
      });
    }

    // 更新 Product
    const updatedProduct = await db.product.update({
      where: { id: validatedData.productId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        real_price: validatedData.real_price,
        IsPublic: validatedData.IsPublic,
        CourseProductTypeArray: validatedData.CoursePorductTypeArray,
        CourseProductStatusArray: validatedData.CoursePorductStatueArray,
      },
    });

    return {
      success: true,
      product: {
        productId: updatedProduct.id,
        title: updatedProduct.title,
        description: updatedProduct.description,
        price: updatedProduct.price,
        real_price: updatedProduct.real_price,
        IsPublic: updatedProduct.IsPublic,
        CoursePorductTypeArray: updatedProduct.CourseProductTypeArray,
        CoursePorductStatueArray: updatedProduct.CourseProductStatusArray,
      },
    };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "更新失敗" };
  }
}