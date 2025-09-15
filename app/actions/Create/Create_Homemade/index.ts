"use server"

import { db } from "@/lib/db" 
import { CreateHomemadeSchema } from "./schema"
import { InputType, ReturnType } from "./types";
// import { redirect } from "next/navigation";
import { CreateSafeAction } from "@/lib/create-safe-action";

const handler = async (data: InputType) : Promise<ReturnType> => { 

    const { Homemade_code, title,description  , school_name , day , time , time_h , teacher ,Ispublic,date_start,date_end} = data;

    let homemade_data;

    try {
        homemade_data = await db.homemade.create({
            data: {
                Homemade_code,
                title,
                description,
                school_name,
                day,
                time,
                time_h,
                teacher,
                Ispublic,
                date_start,
                date_end
            },
            }
        )
        
        console.log("-- Create Homemade on server-- : ",homemade_data,"-- End --");

        return{
            data: homemade_data
        }

    } catch (error) {
        console.log("error : ", error , "-- End --")

        return{ error: error instanceof Error ? error.message : "未知錯誤", }
    }
} 

export const CreateHomemadeAction = CreateSafeAction(CreateHomemadeSchema, handler)