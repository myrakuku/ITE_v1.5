import { z } from "zod"; 

export const CreateCertigificateSchema = z.object({
    name: z.string(),
    date: z.string(),
})