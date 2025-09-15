// "use server"

// import { db } from "@/lib/db" 
// import { CreateBillSchema } from "./schema"
// import type { InputType, ReturnType } from "./types";
// import { CreateSafeAction } from "@/lib/create-safe-action";


// const handler = async (data: InputType) : Promise<ReturnType> => { 

//     const {  client_name , date , title , description , price , total , client_id} = data;

//     let Accounts_data;

//     try {
//         Accounts_data = await db.accounts.create({
//             data: {
//                 client_name,
//                 date,
//                 title,
//                 description,
//                 price,
//                 total,
//                 client_id
//             }
//         })
        
//         console.log("-- Create Accounts on server-- : ",Accounts_data,"-- End --");

//         return{
//             data: Accounts_data
//         }

//     } catch (error) {
//         console.log("error : ", error , "-- End --")

//         return{ error: error instanceof Error ? error.message : "未知錯誤", }
//     }
// } 

// export const CreateBillAction = CreateSafeAction(CreateBillSchema, handler)

// // app/actions/Create/Create_Accounts/index.ts
// 'use server';

// import { db } from '@/lib/db';
// import { CreateAccountsSchema } from './schema';
// import type { InputType, ReturnType } from './types';
// import { CreateSafeAction } from '@/lib/create-safe-action';

// // 更新 InputType，包含 statuename
// export type InputType = {
//   cilent_name: string; // 注意：應更正為 client_name
//   date: string;
//   title: string;
//   description: string;
//   price: number;
//   total: number;
//   client_id: string;
//   statuename: string; // 新增 statuename
// };

// // 更新 ReturnType，與 Prisma 模型一致
// export type ReturnType = {
//   data?: {
//     id: string;
//     cilent_name: string;
//     title: string;
//     description: string;
//     price: number;
//     total: number;
//     date: string;
//     client_id: string;
//     statuename: string;
//     createdAt: Date;
//     updatedAt: Date;
//   };
//   error?: string;
// };

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const { cilent_name, date, title, description, price, total, client_id, statuename } = data;

//   let Accounts_data;

//   try {
//     Accounts_data = await db.accounts.create({
//       data: {
//         cilent_name,
//         date,
//         title,
//         description,
//         price,
//         total,
//         client_id,
//         statuename, // 提供 statuename
//       },
//     });

//     console.log('-- Create Accounts on server-- : ', Accounts_data, '-- End --');

//     return {
//       data: Accounts_data,
//     };
//   } catch (error) {
//     console.log('error : ', error, '-- End --');
//     return { error: error instanceof Error ? error.message : '未知錯誤' };
//   }
// };

// export const CreateAccountsAction = CreateSafeAction(CreateAccountsSchema, handler);



// "use server";

// import { db } from "@/lib/db";
// import { CreateBillSchema } from "./schema";
// import type { InputType, ReturnType } from "./types";
// import { CreateSafeAction } from "@/lib/create-safe-action";

// // 定義輔助函數來驗證和轉換 products
// const validateProducts = (
//   products: unknown
// ): { title: string; description: string; price: number }[] => {
//   if (!products) return [];
//   if (!Array.isArray(products)) return [];

//   return products.filter((item): item is { title: string; description: string; price: number } => {
//     return (
//       typeof item === "object" &&
//       item !== null &&
//       typeof item.title === "string" &&
//       typeof item.description === "string" &&
//       typeof item.price === "number"
//     );
//   });
// };

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const { client_name, date, title, description, total, client_id, products } = data;

//   try {
//     const account = await db.accounts.create({
//       data: {
//         client_name, // 已修正拼寫
//         date,
//         title,
//         description,
//         price: total, // 假設 price 字段使用 total 值，根據需求調整
//         total,
//         client_id,
//         products: products || null, // 將 products 作為 JSON 儲存，若為空則設為 null
//       },
//     });

//     console.log("-- Create Accounts on server -- : ", account, "-- End --");

//     // 返回與 CreateBillSchema 一致的數據
//     return {
//       data: {
//         client_name: account.client_name,
//         title: account.title,
//         description: account.description,
//         price: account.price,
//         total: account.total,
//         date: account.date,
//         client_id: account.client_id,
//         products: validateProducts(account.products), // 轉換並驗證 products
//       },
//     };
//   } catch (error) {
//     console.log("error : ", error, "-- End --");
//     return { error: error instanceof Error ? error.message : "未知錯誤" };
//   }
// };

// export const CreateBillAction = CreateSafeAction(CreateBillSchema, handler);


"use server";

import { db } from "@/lib/db";
import { CreateBillSchema } from "./schema";
import type { InputType, ReturnType } from "./types";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Prisma } from "@prisma/client";

// 定義輔助函數來驗證和轉換 products
const validateProducts = (
  products: unknown
): { title: string; description: string; price: number }[] => {
  if (!products) return [];
  if (!Array.isArray(products)) return [];

  return products.filter((item): item is { title: string; description: string; price: number } => {
    return (
      typeof item === "object" &&
      item !== null &&
      typeof item.title === "string" &&
      typeof item.description === "string" &&
      typeof item.price === "number"
    );
  });
};

const handler = async (data: InputType): Promise<ReturnType> => {
  const { client_name, date, title, description, total, client_id, products } = data;

  try {
    // 将 products 转换为 Prisma 期望的 JSON 格式
    const productsJson = products ? JSON.stringify(products) : null;
    
    const account = await db.accounts.create({
      data: {
        client_name,
        date,
        title,
        description,
        price: total,
        total,
        client_id,
        products: productsJson ?? Prisma.JsonNull, // 使用序列化后的 JSON 字符串
      },
    });

    console.log("-- Create Accounts on server -- : ", account, "-- End --");

    // 解析返回的 products 数据
    const parsedProducts = account.products 
      ? JSON.parse(account.products as string) 
      : [];

    return {
      data: {
        client_name: account.client_name,
        title: account.title,
        description: account.description,
        price: account.price,
        total: account.total,
        date: account.date,
        client_id: account.client_id,
        products: validateProducts(parsedProducts),
      },
    };
  } catch (error) {
    console.log("error : ", error, "-- End --");
    return { error: error instanceof Error ? error.message : "未知錯誤" };
  }
};

export const CreateBillAction = CreateSafeAction(CreateBillSchema, handler);