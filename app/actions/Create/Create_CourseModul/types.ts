import { z } from "zod"; 
import { ActionState } from "@/lib/create-safe-action";
import { CreateCourseModulSchema } from "./schema";
import { CourseModul } from "@prisma/client";




export type InputType = z.infer<typeof CreateCourseModulSchema>;
export type ReturnType = ActionState< CourseModul>

