import { z } from "zod"

export const CreateSchoolSchema = z.object({
    name: z.string()
})