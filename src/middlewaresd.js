import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/login" || path === "/signup" || path === "/resetpass";

  // Retrieve the JWT token from cookies
  const token = request.cookies.get("jwt")?.value || "";

  // If accessing a public path, allow the request
  if (isPublicPath) {
    return NextResponse.next();
  }

  // If not accessing a public path and no token is found, redirect to /login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // If token is found, allow the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static).*)', // Apply middleware to all paths except API routes and static files
  ],
};
