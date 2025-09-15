"use server"

import { db } from "@/lib/db" 
import { CreateSTypeSchema } from "./schema"
import { InputType, ReturnType } from "./types";
// import { redirect } from "next/navigation";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { UserRole } from "@prisma/client";

const handler = async (data: InputType) : Promise<ReturnType> => { 

    const {  typename  , author , role} = data;

    let Certigificate_data;

    try {
        Certigificate_data = await db.courseProductType.create({
            data: {
                typename:typename,
                author:author,
                role: role as UserRole
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

export const CreateTypeAction = CreateSafeAction(CreateSTypeSchema, handler)