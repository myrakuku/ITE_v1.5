"use server"

import { db } from "@/lib/db" 
import { CreateStatueSchema } from "./schema"
import { InputType, ReturnType } from "./types";
// import { redirect } from "next/navigation";
import { CreateSafeAction } from "@/lib/create-safe-action";

const handler = async (data: InputType) : Promise<ReturnType> => { 

    const {  statuename} = data;

    let Certigificate_data;

    try {
        Certigificate_data = await db.courseProductStatus.create({
            data: {
                statuename:statuename
            }
        })
        
        console.log("-- Create Certigificate on server-- : ",Certigificate_data,"-- End --");

        return{
            data: Certigificate_data
        }

    } catch (error) {
        console.log("error : ", error , "-- End --")

        return{ error: error instanceof Error ? error.message : "未知錯誤", }
    }
} 

export const CreateStatueAction = CreateSafeAction(CreateStatueSchema, handler)