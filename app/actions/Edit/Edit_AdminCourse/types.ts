// types.ts
import { z } from "zod";
import type { ActionState } from "@/lib/create-safe-action";
import { EditADminCourseSchema } from "./schema";

export type InputType = z.infer<typeof EditADminCourseSchema>;
export type ReturnType = ActionState<
  
  {
    courseId: string;
    teacher: string[];
    schoolName: string;
    classroom: string | undefined; // 改為 string | null
  }
>;