"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Invoice_Create_Schema } from "./schema";
import { redirect } from "next/navigation";


// app/actions/Create/Create_Invoice/index.ts

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    title,
    content,
    price,
    studentname,
    student_id,        // 這就是 userId
    servetype,
    PaymentMethods,
    Invoice_id,
    DB,
    adminFee,
    total,
    date,
  } = data;

  let invoice_data;

  try {
    invoice_data = await db.invoice.create({
      data: {
        title,
        content: content ?? [],               // 確保為陣列
        price,
        total,
        date,
        studentname,
        student_id,                           // 可保留作為自訂欄位（非關係用）
        servetype,
        PaymentMethods: PaymentMethods ?? [],
        Invoice_id,
        DB: DB ?? 0,
        adminFee: adminFee ?? 0,
        isPayment: false,

        // 正確方式：使用 nested connect 連結 User
        user: {
          connect: {
            id: student_id,                   // 使用 student_id 作為 User 的 id
          },
        },
      },
    });
  } catch (error) {
    console.error('創建發票失敗:', error);
    return { error: '創建發票失敗' };
  }

  console.log("-- invoice_data -- : ", invoice_data, " -- End -- ");
  redirect(`/admin/InvoiceLists`);
};
export const createInvoice_action = CreateSafeAction(Invoice_Create_Schema, handler);