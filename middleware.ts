import { auth } from "./auth";
import { NextResponse } from "next/server";

const publicRoutes = ['/', '/login', "/hide/createadmin", "/forgot-password", "/reset-password" , "/admin/UserLists/createUser","/shop","/register","/about","/complaintFrom"];

export default auth((req) => {
  const currentPath = req.nextUrl.pathname;
  
  if (!req.auth?.user && !publicRoutes.includes(currentPath)) {
    const newUrl = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
