// import { auth } from "./auth";
// import { NextResponse } from "next/server";



// const publicRoutes = [
//   '/', 
//   '/login', 
//   "/hide/createadmin", 
//   "/forgot-password", 
//   "/reset-password" , 
//   "/admin/UserLists/createUser",
//   "/shop",
//   "/register",
//   "/about",
//   "/complaintFrom"
// ];

// export default auth((req) => {
//   const currentPath = req.nextUrl.pathname;
  
//   if (!req.auth?.user && !publicRoutes.includes(currentPath)) {
//     const newUrl = new URL("/", req.nextUrl.origin);
//     return NextResponse.redirect(newUrl);
//   }
// });

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };


// middleware.ts
import { auth } from "./auth";
import { NextResponse } from "next/server";

const publicRoutes = [
  '/',
  '/login',
  '/hide/createadmin',
  '/forgot-password',
  '/reset-password',
  '/admin/UserLists/createUser',
  '/shop',
  '/register',
  '/about',
  '/complaintFrom',
  '/specialCourse',
];

export default auth(async (req) => {
  const currentPath = req.nextUrl.pathname;

  // 檢查是否匹配動態路由 /[shopId] 或 /specialCourse/[courseId]
  const isShopIdRoute = /^\/shop\/[a-zA-Z0-9-]+$/.test(currentPath);
  const isSpecialCourseIdRoute = /^\/specialCourse\/[a-zA-Z0-9-]+$/.test(currentPath);

  if (!req.auth?.user && !publicRoutes.includes(currentPath) && !isShopIdRoute && !isSpecialCourseIdRoute) {
    const newUrl = new URL('/', req.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};