import { z } from "zod";

export const IsPay_Change_Schema = z.object({
    invoiceId: z.string(),
    IsPay: z.boolean(),
})