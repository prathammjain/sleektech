import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, isValidSession } from "@/lib/auth";

/**
 * Next 16 "proxy" (formerly middleware). Gates every /admin route behind the
 * shared-password session cookie. The login page and the login API are left
 * open so a signed-out user can authenticate.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public admin endpoints (no session required).
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(ADMIN_COOKIE)?.value;
  const ok = await isValidSession(cookie);

  if (!ok) {
    // API routes get a 401; pages get bounced to the login screen.
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
