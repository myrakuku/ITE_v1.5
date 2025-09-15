import { z } from 'zod';

export const CreateHomemadeSchema = z.object({
    Homemade_code: z.string(),
    title: z.string(),
    description: z.string(),
    school_name: z.string(),
    day: z.string(),
    time: z.string(),
    time_h: z.number(),
    teacher:z.array(z.string()),
    Ispublic: z.boolean(),
    date_start: z.string(),
    date_end: z.string(),
})