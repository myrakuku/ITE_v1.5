import { z } from "zod"; 
import { ActionState } from "@/lib/create-safe-action";
import { CreateHomemadeSchema } from "./schema";
import { Homemade } from "@prisma/client";




export type InputType = z.infer<typeof CreateHomemadeSchema>;
export type ReturnType = ActionState< Homemade>

