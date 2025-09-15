"use server"

import { db } from "@/lib/db" 
import { CreateHeaderTypeSchema } from "./schema"
import { InputType, ReturnType } from "./types";
import { CreateSafeAction } from "@/lib/create-safe-action";

const handler = async (data: InputType) : Promise<ReturnType> => { 

    const { HeaderTypeName } = data;

    let HeaderType_data;

    try {
        HeaderType_data = await db.headerType.create({
            data: {
                HeaderTypeName
            },
            }
        )
        
        console.log("-- Create HeaderType_data on server-- : ",HeaderType_data,"-- End --");

        return{
            data: HeaderType_data
        }

    } catch (error) {
        console.log("error : ", error , "-- End --")

        return{ error: error instanceof Error ? error.message : "未知錯誤", }
    }
} 

export const CreateHeaderTypeAction = CreateSafeAction(CreateHeaderTypeSchema, handler)