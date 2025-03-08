import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Function to check if a token exists in cookies
function hasToken(req: NextRequest): boolean {
  const { headers, cookies } = req;
  const token = cookies.get("authToken")?.value;
  return !!token;
}

// Define protected routes
const protectedRoutes = [
  "/dashboard",
  "/chat-page",
  "/delete-account",
  "/marketing",
  "/users(.*)",
  "/brand(.*)",
];

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAuthPage = path.startsWith("/login"); // Authentication pages
  const isProtectedRoute = protectedRoutes.includes(path); // Check if route is protected

  if (isAuthPage && hasToken(req)) {
    // If user is logged in and visits the auth page, redirect to dashboard
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isProtectedRoute && !hasToken(req)) {
    // If user is not logged in and trying to access protected routes, redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to specific paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
