import { z } from 'zod';

export const CreateERBSchema = z.object({
    ERB_code: z.string(),
    title: z.string(),
    description: z.string(),
    school_name: z.string(),
    day: z.string(),
    time: z.string(),
    time_h: z.number(),
    teacher:z.array(z.string()),
    Ispublic: z.boolean(),

})