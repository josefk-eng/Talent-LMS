import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "./Utils/Auth";

const protectedRoutes = ["/"];

export default function middleWare(req: NextRequest) {
    if (!isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
        const absoluteURL = new URL("/sign-in",req.nextUrl.origin);
        return NextResponse.redirect(absoluteURL.toString());
    }
}