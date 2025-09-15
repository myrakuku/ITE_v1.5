import { z } from "zod"; 
import { ActionState } from "@/lib/create-safe-action";
import { CreateSchoolSchema } from "./schema";
import { School } from "@prisma/client";




export type InputType = z.infer<typeof CreateSchoolSchema>;
export type ReturnType = ActionState<InputType , School>

