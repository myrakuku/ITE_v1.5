import { z } from 'zod';

export const CreateHeaderTypeSchema = z.object({
  HeaderTypeName: z.string(),
});