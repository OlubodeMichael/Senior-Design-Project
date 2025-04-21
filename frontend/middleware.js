import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(req) {
  /*
  const token = req.cookies.get("jwt")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(
      "YIJo5m87ZOmmwK9b8XlMy9qPlk1X/h8m7WsrlHKkCm+xvGhncycaWNuoGwJYgTVNzEBbWJbMkmF6sVs6d9be7A=="
    );

    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch (err) {
    console.error("Auth error:", err.message);
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("jwt");
    return response;
  }
    */
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
