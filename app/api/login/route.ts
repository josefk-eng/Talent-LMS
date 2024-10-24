import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import * as z from "zod";
import bcrypt from 'bcrypt';

const formSchema = z.object({
    email: z.string().email({
        message:"Invalid Email"
    }),
    password: z.string().min(8, "Password must be at least 8 characters"),

});


async function getUser(email: string): Promise<any | undefined> {
    try {

        const user = await db.schoolAccount.findUnique({
            where: {
                email
            }
        });

        return user

    } catch (error){
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}


export  async function POST(req:Request) {
    const body = await req.json();
    const {email, password} = formSchema.parse(body);

    const user = await getUser(email);

    if (!user) {
        return NextResponse.json({user:null, message: "No Account found with the mentioned email"}, {status: 401});
    }

    const compare = await bcrypt.compare(password, user.password, function (err, result) {
          if (!result){
            console.log(`Password Match returned an Error => ${err}`);
            return NextResponse.json({user:null, message: "Invalid Password"}, {status: 401});
          }
      });
      return NextResponse.json({user:user.id, message: "Logged In Successfully"}, {status: 201});
}