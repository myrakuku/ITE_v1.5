// // app/actions/Create/Create_Product/types.ts
// import { z } from "zod";
// import { ActionState } from "@/lib/create-safe-action";
// import { CreateProductSchema } from "./schema";
// import { Product } from "@prisma/client";

// export type InputType = z.infer<typeof CreateProductSchema>;
// export type ReturnType = ActionState<InputType, Product>;

// app/actions/create-product/types.ts
import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { CreateProductFromSpecialSchema } from "./schema";
import { Product } from "@prisma/client";

export type InputType = z.infer<typeof CreateProductFromSpecialSchema>;
export type ReturnType = ActionState<Product>;