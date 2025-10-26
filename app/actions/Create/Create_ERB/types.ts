import { z } from "zod"; 
import { ActionState } from "@/lib/create-safe-action";
import { CreateERBSchema } from "./schema";
import { ERB } from "@prisma/client";




export type InputType = z.infer<typeof CreateERBSchema>;
export type ReturnType = ActionState< ERB>

