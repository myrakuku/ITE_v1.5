// import { z } from "zod"; 
// import  type { ActionState } from "@/lib/create-safe-action";
// import { CreateBillSchema } from "./schema";
// import type { Accounts } from "@prisma/client";

// export type InputType = z.infer<typeof CreateBillSchema>;
// export type ReturnType = ActionState<InputType , Accounts>



// @/app/actions/Create/Create_Bill/types.ts
// import { z } from "zod";
// import { CreateBillSchema } from "./schema";

// export type InputType = z.infer<typeof CreateBillSchema>;

// export type ReturnType = {
//   data?: z.infer<typeof CreateBillSchema>;
//   error?: string;
// };



// app/actions/Create/Create_Bill/types.ts
import { z } from "zod";
import { CreateBillSchema } from "./schema";

// app/actions/Create/Create_Bill/types.ts
export type InputType = z.infer<typeof CreateBillSchema>;
export type ReturnType = {
  data?: {
    client_name: string;
    title: string;
    description: string;
    price: number;
    total: number;
    date: string;
    client_id: string;
    products: { title: string; description: string; price: number }[];
  };
  error?: string;
};