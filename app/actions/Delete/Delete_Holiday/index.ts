"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

// 定義輸入數據的 schema
const DeleteHolidaySchema = z.object({
  teacherId: z.string().uuid("無效的教師 ID"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "無效的日期格式",
  }),
});

// 定義 Action 狀態類型
type InputType = z.infer<typeof DeleteHolidaySchema>;
type ReturnType = {
  data?: { id: string; teacherholidaysDateTime: string[] };
  error?: string;
};

// Server Action 處理刪除假期日期
export const DeleteHolidayAction = async (input: InputType): Promise<ReturnType> => {
  try {
    // 驗證輸入數據
    const validatedData = DeleteHolidaySchema.parse(input);

    // 查找用戶
    const user = await prisma.user.findUnique({
      where: { id: validatedData.teacherId },
      select: { teacherholidaysDateTime: true },
    });

    if (!user) {
      return { error: "用戶不存在" };
    }

    // 從 teacherholidaysDateTime 數組中移除指定日期
    const updatedHolidays = user.teacherholidaysDateTime.filter(
      (d) => d !== validatedData.date
    );

    // 更新用戶數據
    const updatedUser = await prisma.user.update({
      where: { id: validatedData.teacherId },
      data: {
        teacherholidaysDateTime: updatedHolidays,
      },
      select: {
        id: true,
        teacherholidaysDateTime: true,
      },
    });

    return { data: updatedUser };
  } catch (error) {
    console.error("DeleteHolidayAction error:", error);
    return {
      error: error instanceof Error ? error.message : "無法刪除假期日期",
    };
  }
};