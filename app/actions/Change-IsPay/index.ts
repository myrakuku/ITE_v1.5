"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { IsPay_Change_Schema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { invoiceId, IsPay } = data;
  let invoice_change;
  let receipt_data;

  try {
    // 更新 Invoice 的 isPayment 狀態
    invoice_change = await db.invoice.update({
      where: { id: invoiceId },
      data: { isPayment: IsPay },
    });

    // 查詢 Invoice 資料
    const invoice_data = await db.invoice.findUnique({
      where: { id: invoiceId },
    });

    // 檢查 invoice_data 是否存在
    if (!invoice_data) {
      return {
        error: "找不到指定的發票記錄",
      };
    }

    // 創建 Receipt 記錄
    receipt_data = await db.receipt.create({
      data: {
        title: invoice_data.title,
        content: invoice_data.content,
        price: invoice_data.price,
        invoicebydbid: invoiceId,
        servetype: invoice_data.servetype,
        isPayment: IsPay,
        studentname: invoice_data.studentname,
        Invoice_id: invoice_data.Invoice_id,
        PaymentMethods: invoice_data.PaymentMethods,
        DB: invoice_data.DB,
        adminFee: invoice_data.adminFee,
      },
    });

    // 記錄成功操作（僅用於調試，可根據需要移除）
    console.log("-- invoice_change -- : ", invoice_change, " -- End -- ");
    console.log("-- receipt_data -- : ", receipt_data, " -- End -- ");

    return {
      success: "付款狀態更新成功",
      data: { invoiceId, IsPay }, // 返回與 InputType 一致的 data
    };
  } catch (error) {
    console.error("更新發票或創建收據時發生錯誤:", error);
    return {
      error: error instanceof Error ? error.message : "操作失敗，請稍後重試",
    };
  }
};

export const IsPay_Change_Action = CreateSafeAction(IsPay_Change_Schema, handler);