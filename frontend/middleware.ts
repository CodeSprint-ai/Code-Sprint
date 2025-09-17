// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Centralized route rules
const authConfig = {
  protected: ["/dashboard"],
  public: ["/auth/login", "/auth/signup"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("refresh_token")?.value;

  
  console.log({ token });

  const isAuthenticated = Boolean(token);

  // Helper: matches if route is in protected list
  const isProtectedRoute = authConfig.protected.some((route) =>
    pathname.startsWith(route)
  );

  // Helper: matches if route is exactly in public list
  const isPublicRoute = authConfig.public.includes(pathname);

  // 1️⃣ Not authenticated → accessing protected page → redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    // Preserve "redirect" param so we can send user back after login
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2️⃣ Authenticated → accessing public page → redirect to dashboard
  if (isPublicRoute && isAuthenticated) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // ✅ Otherwise, continue as normal
  return NextResponse.next();
}

// Config: matcher excludes Next.js internals & static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
