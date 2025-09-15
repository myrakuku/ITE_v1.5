import { z } from 'zod';

export const CreateNITTPSchema = z.object({
    title: z.string(),
    description: z.string(),
    school_name: z.string(),
    day: z.string(),
    time: z.string(),
    time_h: z.number(),
    teacher:z.array(z.string()),
    Ispublic: z.boolean(),
    company_name: z.string(),
    company_price: z.number(),
    date_start: z.string(),
    date_end: z.string(),
})