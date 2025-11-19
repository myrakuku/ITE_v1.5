// 'use server';

// import { auth } from '@/auth';
// import { db } from '@/lib/db';

// // 定義與 Prisma Product 模型匹配的類型
// interface Product {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   real_price: number;
//   CourseProductTypeArray: string[];
//   CourseProductStatusArray: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   IsPublic: boolean;
//   courseId: string | null;
// }

// interface CartItem {
//   id: string;
//   cartId: string;
//   productId: string;
//   quantity: number;
//   createdAt: Date;
//   updatedAt: Date;
//   product: Product;
// }

// export interface CartWithItems {
//   id: string;
//   userId: string;
//   createdAt: Date;
//   updatedAt: Date;
//   items: CartItem[];
// }

// export async function addSpcialCourseToCart(
//   specialCourseId: string,
//   quantity: number,
// ): Promise<{ success: true; productId?: string }> {
//   const session = await auth();
//   if (!session?.user?.id) throw new Error('未授權');

//   // 驗證 specialCourse 是否存在
//   const specialCourseExists = await db.specialCourse.findUnique({
//     where: { id: specialCourseId },
//     select: { id: true, title: true, description: true, price: true, isPublic: true },
//   });

//   if (!specialCourseExists) {
//     throw new Error('特殊課程不存在');
//   }

//   if (!specialCourseExists.isPublic) {
//     throw new Error('此課程不公開，無法加入購物車');
//   }

//   // 檢查是否已存在對應的 Product
//   let product = await db.product.findFirst({
//     where: { title: specialCourseExists.title, description: specialCourseExists.description }, // 使用 title 和 description 查找
//     select: { id: true },
//   });

//   // 如果不存在 Product，創建一個
//   if (!product) {
//     product = await db.product.create({
//       data: {
//         title: specialCourseExists.title,
//         description: specialCourseExists.description,
//         price: specialCourseExists.price ? Math.round(specialCourseExists.price) : 0, // 轉為整數
//         real_price: specialCourseExists.price ? Math.round(specialCourseExists.price) : 0,
//         IsPublic: specialCourseExists.isPublic,
//         courseId: null, // 不設置 courseId，因為 specialCourse 不屬於 Course
//         CourseProductTypeArray: [],
//         CourseProductStatusArray: [],
//       },
//     });
//   }

//   const productId = product.id;

//   // 獲取用戶購物車
//   let cart = await db.cart.findFirst({
//     where: { userId: session.user.id },
//     include: {
//       items: {
//         include: {
//           product: {
//             select: {
//               id: true,
//               title: true,
//               description: true,
//               price: true,
//               real_price: true,
//               CourseProductTypeArray: true,
//               CourseProductStatusArray: true,
//               createdAt: true,
//               updatedAt: true,
//               IsPublic: true,
//               courseId: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   if (!cart) {
//     cart = await db.cart.create({
//       data: { userId: session.user.id },
//       include: {
//         items: {
//           include: {
//             product: {
//               select: {
//                 id: true,
//                 title: true,
//                 description: true,
//                 price: true,
//                 real_price: true,
//                 CourseProductTypeArray: true,
//                 CourseProductStatusArray: true,
//                 createdAt: true,
//                 updatedAt: true,
//                 IsPublic: true,
//                 courseId: true,
//               },
//             },
//           },
//         },
//       },
//     });
//   }

//   // 檢查購物車中是否已存在此產品
//   const existingItem = await db.cartItem.findFirst({
//     where: { cartId: cart.id, productId },
//   });

//   try {
//     if (existingItem) {
//       await db.cartItem.update({
//         where: { id: existingItem.id },
//         data: { quantity: existingItem.quantity + quantity },
//       });
//     } else {
//       await db.cartItem.create({
//         data: {
//           cartId: cart.id,
//           productId,
//           quantity,
//         },
//       });
//     }
//     return { success: true, productId };
//   } catch (error) {
//     console.error('添加至購物車失敗:', error);
//     throw new Error('無法添加至購物車');
//   }
// }




'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';

export async function addSpcialCourseToCart(
  specialCourseId: string,
  quantity: number,
): Promise<{ success: true; productId?: string }> {
  const session = await auth();
  if (!session?.user?.id) throw new Error('未授權');

  // 1. 驗證 specialCourse
  const specialCourse = await db.specialCourse.findUnique({
    where: { id: specialCourseId },
    select: { 
      id: true, 
      title: true, 
      description: true, 
      price: true, 
      real_price: true,
      isPublic: true 
    },
  });

  if (!specialCourse) throw new Error('特殊課程不存在');
  // if (!specialCourse.isPublic) throw new Error('此課程不公開，無法加入購物車');

  // 2. 查找對應的 Product（使用 specialCourseId 作為唯一識別）
  let product = await db.product.findFirst({
    where: {
      // 關鍵修正：使用 specialCourseId 而非 title+description
      specialCourseId: specialCourseId,
    },
    select: { id: true },
  });

  // 3. 如果不存在，創建專屬 Product
  if (!product) {
    product = await db.product.create({
      data: {
        title: specialCourse.title,
        description: specialCourse.description,
        price: specialCourse.price || 0,
        real_price: specialCourse.real_price || specialCourse.price || 0,
        IsPublic: specialCourse.isPublic,
        // 關鍵：設置 specialCourseId，確保唯一性
        specialCourseId: specialCourseId,
        CourseProductTypeArray: [],
        CourseProductStatusArray: [],
        isTrash: false,
      },
    });
  }

  const productId = product.id;

  // 4. 加入購物車（與普通商品相同邏輯）
  let cart = await db.cart.findFirst({
    where: { userId: session.user.id },
    include: {
      items: true,
    },
  });

  if (!cart) {
    cart = await db.cart.create({
      data: { userId: session.user.id },
      include: {
        items: true,
      },
    });
  }

  const existingItem = await db.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (existingItem) {
    await db.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
    });
  } else {
    await db.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  return { success: true, productId };
}