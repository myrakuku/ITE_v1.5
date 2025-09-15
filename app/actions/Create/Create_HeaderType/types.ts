import { z } from "zod"; 
import { ActionState } from "@/lib/create-safe-action";
import { CreateHeaderTypeSchema } from "./schema";
import { HeaderType } from "@prisma/client";




export type InputType = z.infer<typeof CreateHeaderTypeSchema>;
export type ReturnType = ActionState<InputType , HeaderType>

