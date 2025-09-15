import z from "zod";

export const CreateSTypeSchema = z.object({

    typename: z.string().min(1, { message: "類型名稱不能為空" }) ,  
    author: z.string().min(1, { message: "作者不能為空" }),
    role: z.string().min(1, { message: "角色不能為空" }),
}) 
