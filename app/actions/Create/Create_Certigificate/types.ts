import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { CreateCertigificateSchema } from "./schema";
import { Certigificate } from "@prisma/client";

export type InputType = z.infer<typeof CreateCertigificateSchema>;
export type ReturnType = ActionState<Certigificate>;