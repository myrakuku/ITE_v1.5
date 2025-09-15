// import { z } from "zod"; 

// export const CreateBillSchema = z.object({
//     client_name: z.string(),
//     title: z.string(),
//     description: z.string(),
//     price: z.number(),
//     total: z.number(),
//     date: z.string(),
//     client_id: z.string(),
// })

// // app/actions/Create/Create_Accounts/schema.ts
// import { z } from 'zod';

// export const CreateAccountsSchema = z.object({
//   cilent_name: z.string().min(1, '客戶名稱不能為空'),
//   date: z.string().min(1, '日期不能為空'),
//   title: z.string().min(1, '標題不能為空'),
//   description: z.string().min(1, '描述不能為空'),
//   price: z.number().positive('價格必須大於 0'),
//   total: z.number().positive('總額必須大於 0'),
//   client_id: z.string().min(1, '客戶 ID 不能為空'),
//   statuename: z.string().min(1, '狀態名稱不能為空'), // 新增 statuename
// });


import { z } from "zod";

// export const CreateBillSchema = z.object({
//   client_name: z.string().min(1, "學生名字不能為空"),
//   title: z.string().min(1, "標題不能為空"),
//   description: z.string().min(1, "內容不能為空"),
//   price: z.number().min(0, "金額不能為負"),
//   total: z.number().min(0, "總金額不能為負"),
//   date: z.string().min(1, "日期不能為空"),
//   client_id: z.string().min(1, "客戶ID不能為空"),
//   products: z
//     .array(
//       z.object({
//         title: z.string().min(1, "商品標題不能為空"),
//         description: z.string().min(1, "商品描述不能為空"),
//         price: z.number().min(0, "商品價格不能為負"),
//       })
//     )
//     .min(1, "至少需要一個商品"),
// });



// app/actions/Create/Create_Bill/schema.ts


// app/actions/Create/Create_Bill/schema.ts

export const CreateBillSchema = z.object({
  client_name: z.string().min(1, "客戶名稱不能為空"),
  title: z.string().min(1, "標題不能為空"),
  description: z.string().min(1, "描述不能為空"),
  total: z.number().int().positive("總額必須為正整數"),
  date: z.string().min(1, "日期不能為空"),
  client_id: z.string().uuid("無效的客戶 ID"),
  products: z
    .array(
      z.object({
        title: z.string().min(1, "產品標題不能為空"),
        description: z.string().min(1, "產品描述不能為空"),
        price: z.number().positive("產品價格必須為正數"),
      })
    )
    .optional(),
}).strict();

export type InputType = z.infer<typeof CreateBillSchema>;
export type ReturnType = {
  data?: {
    client_name: string;
    title: string;
    description: string;
    price: number;
    total: number;
    date: string;
    client_id: string;
    products: { title: string; description: string; price: number }[];
  };
  error?: string;
};