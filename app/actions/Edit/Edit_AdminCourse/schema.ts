// schema.ts
import { z } from "zod";

export const EditADminCourseSchema = z.object({
  courseId: z.string(),
  teacher: z.array(z.string()),
  schoolName: z.string(),
  classroom: z.string().optional(), // 正確：對應 string | undefined
});