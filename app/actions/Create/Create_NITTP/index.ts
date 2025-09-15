"use server"

import { db } from "@/lib/db" 
import { CreateNITTPSchema } from "./schema"
import { InputType, ReturnType } from "./types";
// import { redirect } from "next/navigation";
import { CreateSafeAction } from "@/lib/create-safe-action";

const handler = async (data: InputType) : Promise<ReturnType> => { 

    const {  title , description , school_name , day , time , time_h , teacher ,Ispublic,company_name , company_price,date_start,date_end} = data;

    let NITTP_data;

    try {
        NITTP_data = await db.nITTP.create({
            data: {
                title,
                description,
                school_name,
                day,
                time,
                time_h,
                teacher,
                Ispublic,
                company_name,
                company_price,
                date_start,
                date_end
            },
            }
        )
        
        console.log("-- Create NITTP on server-- : ",NITTP_data,"-- End --");

        return{
            data: NITTP_data
        }

    } catch (error) {
        console.log("error : ", error , "-- End --")

        return{ error: error instanceof Error ? error.message : "未知錯誤", }
    }
} 

export const CreateNITTPAction = CreateSafeAction(CreateNITTPSchema, handler)