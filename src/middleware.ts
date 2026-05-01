import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret"
);

const PUBLIC_API_PATHS = new Set([
  "/api/admin/login",
  "/api/admin/logout",
]);

async function isAuthed(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /api/admin/* (except auth endpoints)
  if (pathname.startsWith("/api/admin/")) {
    if (PUBLIC_API_PATHS.has(pathname)) return NextResponse.next();
    if (!(await isAuthed(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Protect /admin/* (except the /admin login page itself)
  if (pathname.startsWith("/admin")) {
    // /admin and /admin/ are the login page — leave alone
    if (pathname === "/admin" || pathname === "/admin/") {
      return NextResponse.next();
    }
    if (!(await isAuthed(req))) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
