// import { NextRequest, NextResponse } from "next/server";
// import { isAuthenticated } from "./Utils/Auth";

// const protectedRoutes = ["/"];

// export default function middleWare(req: NextRequest) {
//     if (!isAuthenticated && protectedRoutes.includes(req.nextUrl.pathname)) {
//         const absoluteURL = new URL("/sign-in",req.nextUrl.origin);
//         return NextResponse.redirect(absoluteURL.toString());
//     }
// }

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};