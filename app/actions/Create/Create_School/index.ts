"use server"

import { db } from "@/lib/db";
import { CreateSchoolSchema } from "./schema";
import { InputType, ReturnType } from "./types";
// import { redirect } from "next/navigation";
import { CreateSafeAction } from "@/lib/create-safe-action";


const handler = async (data: InputType) : Promise<ReturnType> => { 

const { name } = data;

let school_data

try {

    school_data = await db.school.create({
        data: {
            name
        }
    })
    
    console.log("school_data : ", school_data, "-- End --")
    return {
        data: school_data
    }

} catch (error) {
    console.log("error : ", error , "-- End --")
    return{ error: error instanceof Error ? error.message : "未知錯誤", }
}

}

export const CreateTeacherHolidayAction = CreateSafeAction(CreateSchoolSchema, handler)