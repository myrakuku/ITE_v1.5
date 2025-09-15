import { z } from "zod"; 
import { ActionState } from "@/lib/create-safe-action";
import { CreateNITTPSchema } from "./schema";
import { NITTP} from "@prisma/client";




export type InputType = z.infer<typeof CreateNITTPSchema>;
export type ReturnType = ActionState<InputType , NITTP>

