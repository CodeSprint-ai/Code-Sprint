// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { RoleEnum } from "./enum/role.enum";

// Route configs
const authConfig = {
  protected: {
    [RoleEnum.USER]: ["/dashboard", "/problems", "/profile", "/submissions", "/contests", "/sprint"],
    [RoleEnum.ADMIN]: ["/admin"],
  },
  public: ["/auth/login", "/auth/signup", "/auth/forgot-password", "/auth/reset-password", "/auth/verify-email", "/"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for the refresh_token cookie (indicates active session)
  const sessionCookie = request.cookies.get("refresh_token")?.value;
  const hasSession = Boolean(sessionCookie);

  // For now, we consider user authenticated if they have a session cookie
  // Role-based access control will be handled client-side
  const isAuthenticated = hasSession;

  const isPublicRoute = authConfig.public.some(route =>
    pathname === route || pathname.startsWith(route + "/")
  );

  const isUserRoute = authConfig.protected[RoleEnum.USER].some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = authConfig.protected[RoleEnum.ADMIN].some((route) =>
    pathname.startsWith(route)
  );

  const isProtectedRoute = isUserRoute || isAdminRoute;

  // 🔒 Block protected routes for unauthenticated users
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 🚫 Prevent authenticated users from accessing login/signup
  // (redirect to dashboard if already logged in)
  if (isPublicRoute && isAuthenticated && (pathname.includes("/auth/login") || pathname.includes("/auth/signup"))) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Config: matcher excludes Next.js internals & static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

