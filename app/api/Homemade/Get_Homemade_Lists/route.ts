import { db } from "@/lib/db";
import { NextResponse } from "next/server"; 

export async function GET(req: Request) {
    if(req.method === 'GET'){
        const res = await db.homemade.findMany()
        return NextResponse.json(res)
    }
}
