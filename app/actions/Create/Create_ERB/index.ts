"use server"

import { db } from "@/lib/db" 
import { CreateERBSchema } from "./schema"
import { InputType, ReturnType } from "./types";
// import { redirect } from "next/navigation";
import { CreateSafeAction } from "@/lib/create-safe-action";

const handler = async (data: InputType) : Promise<ReturnType> => { 

    const { ERB_code, title,description  , school_name , day , time , time_h , teacher ,Ispublic} = data;

    let erb_data;

    try {
        erb_data = await db.eRB.create({
            data: {
                ERB_code,
                title,
                description,
                school_name,
                day,
                time,
                time_h,
                teacher,
                Ispublic,
            },
            }
        )
        
        console.log("-- Create ERB on server-- : ",erb_data,"-- End --");

        return{
            data: erb_data
        }

    } catch (error) {
        console.log("error : ", error , "-- End --")

        return{ error: error instanceof Error ? error.message : "未知錯誤", }
    }
} 

export const CreateERBAction = CreateSafeAction(CreateERBSchema, handler)