import { z } from "zod";

export type FieldErrors<T> = {
  [K in keyof T]?: string[];
};

export type ActionState<TInput, TOutput> = {
  fieldErrors?: FieldErrors<TInput>;
  error?: string | null;
  data?: TOutput;
};

export const CreateSafeAction = <TInput, TOutput, TInputRaw = TInput>(
  schema: z.ZodSchema<TOutput, z.ZodTypeDef, TInputRaw>,
  handler: (validatedData: TOutput) => Promise<ActionState<TInputRaw, TOutput>>
) => {
  return async (data: TInputRaw): Promise<ActionState<TInputRaw, TOutput>> => {
    const validationResult = schema.safeParse(data);
    if (!validationResult.success) {
      return {
        fieldErrors: validationResult.error.flatten().fieldErrors as FieldErrors<TInputRaw>,
      };
    }
    return handler(validationResult.data);
  };
};