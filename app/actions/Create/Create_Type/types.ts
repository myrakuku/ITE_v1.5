import { z } from "zod"; 
import { ActionState } from "@/lib/create-safe-action";
import { CreateSTypeSchema } from "./schema";
import { CourseProductType} from "@prisma/client";




export type InputType = z.infer<typeof CreateSTypeSchema>;
export type ReturnType = ActionState<InputType , CourseProductType>

