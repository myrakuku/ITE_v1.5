// // actions/Change-IsPay/types.ts
// import { z } from "zod";
// import { IsPay_Change_Schema } from "./schema";

// export type InputType = z.infer<typeof IsPay_Change_Schema>;
// export type ReturnType = 
//   | { success: string; data?: any; error?: never }
//   | { error: string; success?: never; data?: never };

  

// // app/actions/Change-IsPay/types.ts
// import { z } from "zod";
// import { IsPay_Change_Schema } from "./schema";

// interface Receipt {
//   id: string;
//   title: string;
//   studentname: string;
//   invoicebydbid: string;
//   servetype: string;
//   price: number;
//   content: string[];
//   PaymentMethods: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   isPayment: boolean;
//   DB: number;
//   adminFee: number;
//   Invoice_id: string;
// }

// export type InputType = z.infer<typeof IsPay_Change_Schema>;
// export type ReturnType =
//   | { success: string; data?: Receipt; error?: never }
//   | { error: string; success?: never; data?: never };



// app/actions/Change-IsPay/types.ts
import { z } from "zod";
import { IsPay_Change_Schema } from "./schema";

export type InputType = z.infer<typeof IsPay_Change_Schema>;
export type ReturnType =
  | { success: string; data?: { invoiceId: string; IsPay: boolean }; error?: never }
  | { error: string; success?: never; data?: never };