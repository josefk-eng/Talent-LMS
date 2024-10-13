'use client'
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    try {

        const { email , password} = await req.json();

        const account = await db.schoolAccount.findFirst({
            where:{
                email: email
            }
        });

        if (!account) {
            return new NextResponse("Not Found",{status:404});
        }
        return NextResponse.json(account);
        
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Error", {status: 500});
    }

}