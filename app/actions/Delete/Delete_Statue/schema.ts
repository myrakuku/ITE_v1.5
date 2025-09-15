import { z } from "zod"; 

export const DeleteStatueSchema = z.object({
    StatueId: z.string()
})