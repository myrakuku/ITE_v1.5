import { z } from "zod";


 export const CreateTeacherHolidaySchema = z.object({
   TeacherId: z.string(),
    date: z.array(z.string()),
 })