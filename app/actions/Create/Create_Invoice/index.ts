"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Invoice_Create_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {

        title,
        content,
        price,
        studentname,
        student_id,
        servetype,
        PaymentMethods,
        Invoice_id,
        DB,
        adminFee,

        } = data;

    let invoice_data;

    try {
        invoice_data= await db.invoice.create({
            data:{

                title:title,
                content:content,
                price:price,
                studentname:studentname,
                student_id:student_id,
                servetype: servetype,
                PaymentMethods:PaymentMethods,
                Invoice_id:Invoice_id,
                DB: DB,
                adminFee: adminFee,

            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- invoice_data -- : " , invoice_data , " -- End -- ")
    return redirect(`/admin/InvoiceLists`)
}

export const createInvoice_action = CreateSafeAction(Invoice_Create_Schema, handler)