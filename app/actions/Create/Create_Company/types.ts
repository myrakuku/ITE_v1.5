import { z } from "zod"; 
import { ActionState } from "@/lib/create-safe-action";
import { CreateCompanySchema } from "./schema";
import { company } from "@prisma/client";




export type InputType = z.infer<typeof CreateCompanySchema>;
export type ReturnType = ActionState<InputType , company>

