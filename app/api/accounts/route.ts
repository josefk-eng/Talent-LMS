import { db } from "@/lib/db";
import { count } from "console";
import { NextResponse } from "next/server";

export async function POST(req:Request) {


    try {

        const { name, country, district, subcounty, parish, email, password} = await req.json();

        const account = await db.schoolAccount.create({
            data: {
                name,
                country,
                district,
                subcounty,
                parish,
                email,
                password
            }
        });

        return NextResponse.json(account);
        
    } catch (error) {
        console.log("[ACCOUNTS]", error);
        return new NextResponse("Internal Error", {status: 500});

    }
    
}