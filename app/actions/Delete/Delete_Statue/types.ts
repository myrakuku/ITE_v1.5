import { z } from "zod"; 
import type{ ActionState } from "@/lib/create-safe-action";
import { DeleteStatueSchema } from "./schema";
import type{ Accounts } from "@prisma/client";




export type InputType = z.infer<typeof DeleteStatueSchema>;
export type ReturnType = ActionState<InputType , Accounts>

