import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt"
import * as z from "zod";


const formSchema = z.object({
    name: z.string().min(2, {
        message: "School Name Required"
    }),
    country: z.string().min(2, {message:"Please select your country"}),
    district: z.string().min(2,{message:"Please select your district"}),
    subcounty: z.string().min(2, {message:"Please select your subcounty"}),
    parish: z.string().min(2, {message:"Please select your parish"}),
    email: z.string().email({
        message:"Invalid Email"
    }),
    password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/\d/, "Password must contain at least one digit").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});



export  async function POST(req:Request) {
    
    const body = await req.json();
    const {email, name, password, country, parish, subcounty, district} = formSchema.parse(body);

    //check if email exist
    const emailExists = await db.schoolAccount.findUnique({
        where: {
            email: email
        }
    });

    if (emailExists) {
        return NextResponse.json({user:null, message: "This Email is associated with another account"}, {status: 409});
    }

    //check if name exists
    const nameExists = await db.schoolAccount.findUnique({
        where: {
            name: name
        }
    });

    if (nameExists) {
        return NextResponse.json({user:null, message:"School name already exists"}, {status: 409});
    }

    const pass = await hash(password, 10);

    const user = await db.schoolAccount.create({
        data:{
            name,
            email,
            password:pass,
            district,
            subcounty,
            country,
            parish
        }

    });

    const { password: newUserPassword, ...rest } = user

    return NextResponse.json({user:rest, message:"Account Created Successfully"}, {status:201})

}