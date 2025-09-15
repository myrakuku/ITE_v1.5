"use server";

import { prisma } from "@/lib/prisma";
import { EditProductSchema } from "./schema";
import { InputType, ReturnType } from "./types";
import { CreateSafeAction } from "@/lib/create-safe-action";

// 定義返回數據的接口，與 InputType 一致
interface ProductResponse {
  productId: string;
  title: string;
  description: string;
  price: number;
  real_price: number;
  IsPublic: boolean;
  CoursePorductTypeArray: string[];
  CoursePorductStatueArray: string[];
}

const handler = async (data: InputType): Promise<ReturnType> => {
  try {
    const validatedData = EditProductSchema.parse(data);

    const existingProduct = await prisma.product.findUnique({
      where: { id: validatedData.productId },
    });

    if (!existingProduct) {
      return {
        error: "產品不存在",
      };
    }

    const updatedProduct = await prisma.product.update({
      where: { id: validatedData.productId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        price: validatedData.price,
        real_price: validatedData.real_price,
        IsPublic: validatedData.IsPublic,
        CourseProductTypeArray: validatedData.CoursePorductTypeArray,
        CourseProductStatusArray: validatedData.CoursePorductStatueArray,
        updatedAt: new Date(),
      },
    });

    console.log("-- Edit Product on server --: ", updatedProduct, " -- End --");

    // 構建與 InputType 一致的響應物件
    const response: ProductResponse = {
      productId: updatedProduct.id, // 將 id 映射為 productId
      title: updatedProduct.title,
      description: updatedProduct.description,
      price: updatedProduct.price,
      real_price: updatedProduct.real_price,
      IsPublic: updatedProduct.IsPublic,
      CoursePorductTypeArray: updatedProduct.CourseProductTypeArray,
      CoursePorductStatueArray: updatedProduct.CourseProductStatusArray,
    };

    return {
      data: response,
    };
  } catch (error) {
    console.error("EditProductAction error: ", error);
    return {
      error: error instanceof Error ? error.message : "無法更新產品數據，請稍後重試",
    };
  }
};

export const EditProductAction = CreateSafeAction(EditProductSchema, handler);