// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { RoleEnum } from "./enum/role.enum";

// Route configs
const authConfig = {
  protected: {
    [RoleEnum.USER]: ["/dashboard", "/problems"],
    [RoleEnum.ADMIN]: ["/admin"],
  },
  public: ["/auth/login", "/auth/signup", "/"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("refresh_token")?.value;

  let role: RoleEnum | null = null;
  console.log({ token });

  if (token) {
    try {
      // ✅ Decode token and extract role and expiration
      const decoded = jwt.decode(token) as { exp?: number; role?: RoleEnum };

      // Check if token is expired
      if (decoded?.exp && decoded.exp * 1000 > Date.now()) {
        role = decoded?.role ?? null;
      } else {
        console.warn("Token expired");
      }
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  const isAuthenticated = Boolean(token && role);

  const isPublicRoute = authConfig.public.includes(pathname);

  const isUserRoute = authConfig.protected[RoleEnum.USER].some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = authConfig.protected[RoleEnum.ADMIN].some((route) =>
    pathname.startsWith(route)
  );

  // 🔒 Block protected routes for unauthenticated users
  if ((isUserRoute || isAdminRoute) && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 🚫 Prevent authenticated users from accessing login/signup
  if (isPublicRoute && isAuthenticated) {
    const redirectUrl = new URL(
      role === RoleEnum.ADMIN ? "/admin/dashboard" : "/dashboard",
      request.url
    );
    return NextResponse.redirect(redirectUrl);
  }

  // 👮 Role-based protection
  if (isAdminRoute && role !== RoleEnum.ADMIN) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (isUserRoute && role !== RoleEnum.USER) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

// Config: matcher excludes Next.js internals & static assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
