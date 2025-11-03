import { ActionState } from "@/lib/create-safe-action";
import { Invoice } from "@prisma/client";
import { z } from "zod";
import { Invoice_Create_Schema } from "./schema";

export type InputType = z.infer<typeof Invoice_Create_Schema>;
// date 現在是 Date（非 optional）

export type ReturnType = ActionState<Invoice>;