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
    student_id,
    servetype,
    PaymentMethods,
    Invoice_id,
    DB,
    adminFee,
    total,
    date, // 現在一定是 Date
  } = data;

  let invoice_data;

  try {
    invoice_data = await db.invoice.create({
      data: {
        title,
        content,
        price,
        studentname,
        student_id,
        servetype,
        PaymentMethods: PaymentMethods ?? [],
        Invoice_id,
        DB,
        adminFee,
        total,
        date, // 直接使用，永遠是 Date
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