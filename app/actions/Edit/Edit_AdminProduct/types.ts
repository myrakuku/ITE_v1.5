// import { z } from "zod";
// import { ActionState } from "@/lib/create-safe-action";
// import { EditProductSchema } from "./schema";

// export interface ProductResponse {
//   productId: string;
//   title: string;
//   description: string;
//   price: number;
//   real_price: number;
//   IsPublic: boolean;
//   CoursePorductTypeArray: string[];
//   CoursePorductStatueArray: string[];
//   video_urls?: string[];
// }

// export type InputType = z.infer<typeof EditProductSchema>;
// export type ReturnType = ActionState< ProductResponse> & {
//   success: boolean;
//   product?: ProductResponse;
//   error?: string; // 新增 error 屬性
// };

import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { EditProductSchema } from "./schema";

export interface ProductResponse {
  productId: string;
  title: string;
  description: string;
  price: number;
  real_price: number;
  IsPublic: boolean;
  CoursePorductTypeArray: string[];
  CoursePorductStatueArray: string[];
  video_urls?: string[];
}

// 僅在 Client Component 使用 File[]
export type InputType = z.infer<typeof EditProductSchema> & {
  images?: File[];
};

export type ReturnType = ActionState<ProductResponse> & {
  success: boolean;
  product?: ProductResponse;
  error?: string;
};