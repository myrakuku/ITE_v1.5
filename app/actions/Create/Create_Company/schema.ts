import { z } from "zod";

export const CreateCompanySchema = z.object({
    name: z.string(),
})