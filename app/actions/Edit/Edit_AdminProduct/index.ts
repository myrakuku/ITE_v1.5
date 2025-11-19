// app/actions/Edit/Edit_AdminProduct/index.ts
'use server';

import { db } from "@/lib/db";
import { auth } from "@/auth";
import OSS from "ali-oss";
import { EditProductSchema } from "./schema";
import { revalidatePath } from "next/cache";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// 型別守衛：判斷是否為 File（Node.js + Web File）
function isFile(obj: unknown): obj is File {
  return (
    obj != null &&
    typeof obj === "object" &&
    "name" in obj &&
    "size" in obj &&
    "type" in obj &&
    typeof (obj as any).arrayBuffer === "function"
  );
}

export async function EditProductAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { success: false, error: "未授權：僅限管理員操作" };
  }

  try {
    const rawData = {
      productId: formData.get("productId") as string | null,
      title: formData.get("title") as string | null,
      description: formData.get("description") as string | null,
      price: Number(formData.get("price") ?? 0),
      real_price: Number(formData.get("real_price") ?? 0),
      IsPublic: formData.get("IsPublic") === "true",
      CoursePorductTypeArray: JSON.parse((formData.get("CoursePorductTypeArray") as string) || "[]"),
      CoursePorductStatueArray: JSON.parse((formData.get("CoursePorductStatueArray") as string) || "[]"),
      video_urls: JSON.parse((formData.get("video_urls") as string) || "[]"),
      images: formData.getAll("images"),
    };

    // Zod 驗證
    const validatedData = EditProductSchema.parse(rawData);

    const productExists = await db.product.findUnique({
      where: { id: validatedData.productId },
    });
    if (!productExists) {
      return { success: false, error: "產品不存在" };
    }

    // === 處理圖片：取代舊圖片 ===
    const uploadedImageUrls: string[] = [];

    if (validatedData.images && validatedData.images.length > 0) {
      const ossClient = new OSS({
        region: process.env.OSS_REGION!,
        accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
        accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
        bucket: process.env.OSS_BUCKET!,
        endpoint: process.env.OSS_ENDPOINT,
      });

      // 1. 先刪除舊圖片（資料庫 + OSS）
      const existingImages = await db.product_Img.findMany({
        where: { ProductId: validatedData.productId },
      });

      for (const img of existingImages) {
        const fileName = img.img_url.split("/").slice(-2).join("/"); // 提取 OSS 路徑
        try {
          await ossClient.delete(fileName);
        } catch (err) {
          console.warn(`刪除 OSS 圖片失敗: ${fileName}`, err);
        }
      }

      await db.product_Img.deleteMany({
        where: { ProductId: validatedData.productId },
      });

      // 2. 上傳新圖片
      for (const image of validatedData.images) {
        if (!isFile(image)) continue;

        if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
          return { success: false, error: `不支援的圖片格式：${image.name}` };
        }
        if (image.size > MAX_FILE_SIZE) {
          return { success: false, error: `圖片太大：${image.name}` };
        }

        const fileName = `products/${validatedData.productId}/${Date.now()}_${image.name}`;
        const buffer = Buffer.from(await image.arrayBuffer());
        const result = await ossClient.put(fileName, buffer);

        if (result.url) {
          uploadedImageUrls.push(result.url);
        }
      }

      // 3. 寫入新圖片
      if (uploadedImageUrls.length > 0) {
        await db.product_Img.createMany({
          data: uploadedImageUrls.map((url) => ({
            img_url: url,
            ProductId: validatedData.productId,
          })),
        });
      }
    }

    // === 處理影片 URL：取代舊影片 ===
    const videoUrls = validatedData.video_urls || [];
    if (videoUrls.length > 0) {
      await db.product_video.deleteMany({
        where: { ProductId: validatedData.productId },
      });
      await db.product_video.createMany({
        data: videoUrls.map((url) => ({
          video_url: url,
          ProductId: validatedData.productId,
        })),
      });
    }

    // === 更新產品主體 ===
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

    // 重新驗證快取
    revalidatePath("/admin/ProductLists");
    revalidatePath(`/admin/ProductLists/${validatedData.productId}/edit`);

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
    console.error("EditProductAction error:", err);
    return { success: false, error: err instanceof Error ? err.message : "更新失敗" };
  }
}