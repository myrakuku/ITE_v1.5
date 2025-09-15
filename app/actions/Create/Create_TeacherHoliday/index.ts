// "use server"

// import { db } from "@/lib/db";
// import { CreateTeacherHolidaySchema } from "./schema";
// import { InputType, ReturnType } from "./types";
// import { CreateSafeAction } from "@/lib/create-safe-action";

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const { date, TeacherId } = data;

//   try {
//     // 檢查是否已有該 ID 的記錄
//     const existingUser = await db.user.findUnique({
//       where: { id: TeacherId },
//       select: { teacherholidaysDateTime: true }, // 僅選擇需要的欄位
//     });

//     if (!existingUser) {
//       return { error: "找不到指定的教師記錄" };
//     }

//     // 合併現有假期數據和新輸入的日期，確保不重複
//     const currentHolidays = existingUser.teacherholidaysDateTime || [];
//     const updatedHolidays = [...new Set([...currentHolidays, ...date])]; // 去重

//     // 更新教師的假期數據
//     const teacherHolidayData = await db.user.update({
//       where: { id: TeacherId },
//       data: {
//         teacherholidaysDateTime: updatedHolidays,
//         updatedAt: new Date(),
//       },
//     });

//     console.log("-- Create Teacher Holiday on server --: ", teacherHolidayData, " -- End --");

//     return {
//       data: teacherHolidayData,
//     };
//   } catch (error) {
//     console.error("CreateTeacherHolidayAction error: ", error);
//     return {
//       error: error instanceof Error ? error.message : "無法更新教師假期數據，請稍後重試",
//     };
//   }
// };

// export const CreateTeacherHolidayAction = CreateSafeAction(CreateTeacherHolidaySchema, handler);

"use server"

import { db } from "@/lib/db";
import { CreateTeacherHolidaySchema } from "./schema";
import { InputType, ReturnType } from "./types";
import { CreateSafeAction } from "@/lib/create-safe-action";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { date, TeacherId } = data;

  try {
    // 檢查是否已有該 ID 的記錄
    const existingUser = await db.user.findUnique({
      where: { id: TeacherId },
      select: { teacherholidaysDateTime: true, role: true },
    });

    if (!existingUser) {
      return { error: "找不到指定的教師記錄" };
    }

    // 確保用戶是 TEACHER 或 ADMIN
    if (existingUser.role !== "TEACHER" && existingUser.role !== "ADMIN") {
      return { error: "無權限更新教師假期" };
    }

    // 合併現有假期數據和新輸入的日期，確保不重複
    const currentHolidays = existingUser.teacherholidaysDateTime || [];
    const updatedHolidays = [...new Set([...currentHolidays, ...date])];

    // 更新教師的假期數據
    const teacherHolidayData = await db.user.update({
      where: { id: TeacherId },
      data: {
        teacherholidaysDateTime: updatedHolidays,
        updatedAt: new Date(),
      },
      select: { id: true, teacherholidaysDateTime: true },
    });

    console.log("-- Create Teacher Holiday on server --: ", teacherHolidayData, " -- End --");

    // 映射返回數據到 TeacherHolidayData 結構
    return {
      data: {
        TeacherId: teacherHolidayData.id,
        date: teacherHolidayData.teacherholidaysDateTime,
      },
    };
  } catch (error) {
    console.error("CreateTeacherHolidayAction error: ", error);
    return {
      error: error instanceof Error ? error.message : "無法更新教師假期數據，請稍後重試",
    };
  }
};

export const CreateTeacherHolidayAction = CreateSafeAction(CreateTeacherHolidaySchema, handler);