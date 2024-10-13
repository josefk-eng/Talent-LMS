'use client'
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    { params }: {params: { courseId: string}}
) {

    try {
        // const { userId } = ""
        const { courseId } = params;
        const values = await req.json();
        
        // if (!userId) {
        //     return  new NextResponse("Unauthorized", { status: 401 });
        // }

        const course = await db.course.update({
            where: {
                id:params.courseId,
                // userId
            },
            data: {
                ...values,
            }
        });

        


    } catch (error) {
        console.log("[COURSE_ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
    
}