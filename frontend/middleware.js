import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

// JWT verification helper
async function verifyJWT(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("JWT Error:", err.message);
    return null;
  }
}

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("jwt")?.value;

  // Public paths
  const isPublic =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname === "/";

  if (isPublic) {
    return NextResponse.next();
  }

  // No token? Redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // Invalid token? Redirect to login and delete cookie
  const payload = await verifyJWT(token);
  if (!payload) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("jwt");
    return res;
  }

  // ✅ User is authenticated, allow access
  return NextResponse.next();
}

// Apply only to protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
