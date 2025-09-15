// // "use server";

// // import { db } from "@/lib/db";
// // import { CreateProductSchema } from "./schema";
// // import { InputType, ReturnType } from "./types";
// // import { CreateSafeAction } from "@/lib/create-safe-action";

// // const handler = async (data: InputType): Promise<ReturnType> => {
// //   const { title, description, price ,IsPublic,CoursePorductTypeArray ,CoursePorductStatueArray} = data;

// //   // 調試：檢查 price 的類型
// //   console.log("-- Input price type -- :", typeof price, "-- Value -- :", price);

// //   // 驗證 price 是否有效（Zod 已經處理，但添加防範措施）
// //   if (typeof price !== "number" || isNaN(price) || price < 0) {
// //     return { error: "價格必須是有效的非負數字" };
// //   }

// //   let product_data;

// //   try {
// //     product_data = await db.product.create({
// //       data: {
// //         title,
// //         description,
// //         price, // 直接使用 price，因為 CreateProductSchema 保證是數字
// //         IsPublic,
// //         CoursePorductTypeArray,
// //         CoursePorductStatueArray,
// //       },
// //     });

// //     console.log("-- Create Product on server -- :", product_data, "-- End --");

// //     return {
// //       data: product_data,
// //     };
// //   } catch (error) {
// //     console.log("-- Error -- :", error, "-- End --");
// //     return { error: error instanceof Error ? error.message : "未知錯誤" };
// //   }
// // };

// // export const CreateProductAction = CreateSafeAction(CreateProductSchema, handler);


// "use server";

// import { db } from "@/lib/db";
// import { CreateProductSchema } from "./schema";
// import { InputType, ReturnType } from "./types";
// import { CreateSafeAction } from "@/lib/create-safe-action";

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const { title, description, price, IsPublic, CoursePorductTypeArray, CoursePorductStatueArray, courseId , real_price } = data;

//   console.log("-- Input price type -- :", typeof price, "-- Value -- :", price);
//   console.log("-- Input courseId -- :", courseId);

//   // 驗證 price
//   if (typeof price !== "number" || isNaN(price) || price < 0) {
//     return { error: "價格必須是有效的非負數字" };
//   }

//   // 如果提供了 courseId，驗證課程是否存在
//   if (courseId) {
//     const courseExists = await db.course.findUnique({
//       where: { id: courseId },
//     });
//     if (!courseExists) {
//       return { error: "無效的課程 ID，課程不存在" };
//     }
//   }

//   try {
//     const product_data = await db.product.create({
//       data: {
//         title,
//         description,
//         price,
//         real_price,
//         IsPublic,
//         CoursePorductTypeArray,
//         CoursePorductStatueArray,
//         courseId,
//       },
//     });

//     console.log("-- Create Product on server -- :", product_data, "-- End --");

//     return {
//       data: product_data,
//     };
//   } catch (error) {
//     console.log("-- Error -- :", error, "-- End --");
//     return { error: error instanceof Error ? error.message : "未知錯誤" };
//   }
// };

// export const CreateProductAction = CreateSafeAction(CreateProductSchema, handler);

"use server";

import { db } from "@/lib/db";
import { CreateProductSchema } from "./schema";
import { InputType, ReturnType } from "./types";
import { CreateSafeAction } from "@/lib/create-safe-action";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { title, description, price, real_price, IsPublic, CourseProductTypeArray, CourseProductStatusArray, courseId } = data;


  console.log("-- Input CourseProductTypeArray -- :", CourseProductTypeArray, "-- Value -- :", CourseProductTypeArray);
  // console.log("-- Input price type -- :", typeof price, "-- Value -- :", price);
  // console.log("-- Input courseId -- :", courseId);

  // 驗證 price
  if (typeof price !== "number" || isNaN(price) || price < 0) {
    return { error: "價格必須是有效的非負數字" };
  }

  // 如果提供了 courseId，驗證課程是否存在並更新 Producted 字段
  if (courseId) {
    const courseExists = await db.course.findUnique({
      where: { id: courseId },
    });
    if (!courseExists) {
      return { error: "無效的課程 ID，課程不存在" };
    }
  }

  try {
    // 開始事務，確保產品創建和課程更新同時成功
    const product_data = await db.$transaction(async (tx) => {
      // 創建產品
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
        },
      });

      // 如果有 courseId，更新對應課程的 Producted 字段
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
    console.log("-- Error -- :", error, "-- End --");
    return { error: error instanceof Error ? error.message : "未知錯誤" };
  }
};

export const CreateProductAction = CreateSafeAction(CreateProductSchema, handler);