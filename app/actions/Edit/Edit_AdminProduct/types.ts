import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { EditProductSchema } from "./schema";

// 定義響應類型，與 EditProductSchema 一致
export interface ProductResponse {
  productId: string;
  title: string;
  description: string;
  price: number;
  real_price: number;
  IsPublic: boolean;
  CoursePorductTypeArray: string[];
  CoursePorductStatueArray: string[];
}

export type InputType = z.infer<typeof EditProductSchema>;
export type ReturnType = ActionState<InputType, ProductResponse>;