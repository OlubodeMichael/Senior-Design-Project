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

  // Check if user is authenticated
  const isAuthenticated = token && (await verifyJWT(token));

  // If user is authenticated and trying to access login/signup, redirect to dashboard
  if (isAuthenticated && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // For public paths, no need to check authentication
  if (isPublic) {
    return NextResponse.next();
  }

  // No token? Redirect to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    // Store the original URL to redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname);
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

// Apply middleware to all routes
export const config = {
  matcher: ["/((?!api/public|_next/static|_next/image|favicon.ico).*)"],
};
