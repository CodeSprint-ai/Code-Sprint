// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Centralized route rules
const authConfig = {
  protected: ["/dashboard"],
  public: ["/auth/login", "/auth/signup","/"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("refresh_token")?.value;

  
  console.log({ token });

  const isAuthenticated = Boolean(token);

  const isProtectedRoute = authConfig.protected.some((route) =>
    pathname.startsWith(route)
  );

  const isPublicRoute = authConfig.public.includes(pathname);

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicRoute && isAuthenticated) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

// Config: matcher excludes Next.js internals & static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
