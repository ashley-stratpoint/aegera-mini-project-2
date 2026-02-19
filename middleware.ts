import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/blogs/write(.*)',
  '/blogs/edit(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
    if (req.nextUrl.pathname.startsWith('/api/blogs')) {
        if (req.method === 'GET') {
            return NextResponse.next();
        }
        await auth.protect();
    }
    
    if (isProtectedRoute(req)) {
        await auth.protect();
    }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};