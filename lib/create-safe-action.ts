// import { z } from "zod";

// export type FieldErrors<T> = {
//   [K in keyof T]?: string[];
// };

// export type ActionState<TInput, TOutput> = {
//   fieldErrors?: FieldErrors<TInput>;
//   error?: string | null;
//   data?: TOutput;
// };

// export const CreateSafeAction = <TInput, TOutput, TInputRaw = TInput>(
//   schema: z.ZodSchema<TOutput, z.ZodTypeDef, TInputRaw>,
//   handler: (validatedData: TOutput) => Promise<ActionState<TInputRaw, TOutput>>
// ) => {
//   return async (data: TInputRaw): Promise<ActionState<TInputRaw, TOutput>> => {
//     const validationResult = schema.safeParse(data);
//     if (!validationResult.success) {
//       return {
//         fieldErrors: validationResult.error.flatten().fieldErrors as FieldErrors<TInputRaw>,
//       };
//     }
//     return handler(validationResult.data);
//   };
// };







import { z } from "zod";

export type ActionState<TOutput> = {
  data?: TOutput;
  error?: string;
};

export function CreateSafeAction<TInput, TOutput>(
  schema: z.ZodSchema<TInput>,
  handler: (validatedData: TInput) => Promise<ActionState<TOutput>>
) {
  return async (data: TInput): Promise<ActionState<TOutput>> => {
    const validationResult = schema.safeParse(data);
    if (!validationResult.success) {
      return {
        error: validationResult.error.errors.map((e) => e.message).join(", "),
      };
    }

    return handler(validationResult.data);
  };
}


// export type ActionState<TInput, TOutput> = {
//   fieldErrors?: FieldErrors<TInput>;
//   error?: string | null;
//   data?: TOutput;
// };

// export const CreateSafeAction = <TInput, TOutput, TInputRaw = TInput>(
//   schema: z.ZodSchema<TOutput, z.ZodTypeDef, TInputRaw>,
//   handler: (validatedData: TOutput) => Promise<ActionState<TInputRaw, TOutput>>
// ) => {
//   return async (data: TInputRaw): Promise<ActionState<TInputRaw, TOutput>> => {
//     const validationResult = schema.safeParse(data);
//     if (!validationResult.success) {
//       return {
//         fieldErrors: validationResult.error.flatten().fieldErrors as FieldErrors<TInputRaw>,
//       };
//     }
//     return handler(validationResult.data);
//   };
// };

// // lib/create-safe-action.ts
// export type ActionState<TInput, TOutput> = {
//   data?: TOutput;
//   error?: string;
// };

// export function CreateSafeAction<TInput, TOutput>(
//   schema: z.ZodSchema<TInput>,
//   handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>
// ) {
//   return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
//     const validationResult = schema.safeParse(data);
//     if (!validationResult.success) {
//       return {
//         error: validationResult.error.errors.map(e => e.message).join(', '),
//       };
//     }

//     return handler(validationResult.data);
//   };
// }