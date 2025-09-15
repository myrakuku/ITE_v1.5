"use server"

import { db } from "@/lib/db" 
import { CreateCompanySchema } from "./schema"
import { InputType, ReturnType } from "./types";
// import { redirect } from "next/navigation";
import { CreateSafeAction } from "@/lib/create-safe-action";

const handler = async (data: InputType) : Promise<ReturnType> => { 

    const {  name } = data;

    let company_data;

    try {
        company_data = await db.company.create({
            data: {
                name
            }
        })
        
        console.log("-- Create Company on server-- : ",company_data,"-- End --");

        return{
            data: company_data
        }

    } catch (error) {
        console.log("error : ", error , "-- End --")

        return{ error: error instanceof Error ? error.message : "未知錯誤", }
    }
} 

export const CreateCompanyAction = CreateSafeAction(CreateCompanySchema, handler)