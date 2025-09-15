import { z } from "zod"; 
import { ActionState } from "@/lib/create-safe-action";
import { CreateStatueSchema } from "./schema";
import { CourseProductStatus} from "@prisma/client";




export type InputType = z.infer<typeof CreateStatueSchema>;
export type ReturnType = ActionState<InputType , CourseProductStatus>

