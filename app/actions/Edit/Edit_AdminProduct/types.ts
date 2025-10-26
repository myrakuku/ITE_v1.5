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

export type InputType = z.infer<typeof EditProductSchema>;
export type ReturnType = ActionState< ProductResponse> & {
  success: boolean;
  product?: ProductResponse;
  error?: string; // 新增 error 屬性
};

// // app/actions/Edit/Edit_AdminProduct/types.ts
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
// }

// export type InputType = z.infer<typeof EditProductSchema>;
// export type ReturnType = ActionState<InputType, ProductResponse>;