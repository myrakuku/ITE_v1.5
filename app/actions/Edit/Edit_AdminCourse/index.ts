"use server";

import { prisma } from "@/lib/prisma";
import { EditADminCourseSchema } from "./schema";
import { InputType, ReturnType } from "./types";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Prisma } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { courseId, teacher, schoolName, classroom } = data;

  try {
    const updatedCourse = await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        teacher,
        schoolName,
        classroom: classroom || null, // 將 string | undefined 轉為 string | null
      },
    });
    console.log(updatedCourse);
    return {
      data: {
        courseId: updatedCourse.id,
        teacher: updatedCourse.teacher as string[],
        schoolName: updatedCourse.schoolName,
        classroom: updatedCourse.classroom as string | undefined,
      },

      
    };

    
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      return {
        error: "找不到指定的課程",
      };
    }
    console.log("Error updating course:", error);
    return {
      error: "更新課程失敗，請稍後再試",
    };
  }
};

export const EditAdminCourseAction = CreateSafeAction(EditADminCourseSchema, handler);