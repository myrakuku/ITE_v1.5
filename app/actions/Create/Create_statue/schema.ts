import z from "zod";

export const CreateStatueSchema = z.object({

    statuename: z.string().min(1, { message: "狀態名稱不能為空" }),
}) 
