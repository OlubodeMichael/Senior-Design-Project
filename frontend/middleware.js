import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup']

export async function middleware(req) {
  /*
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("jwt")?.value;

  if(publicRoutes.includes(pathname)) {
    if(token) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
    return NextResponse.next()
  }

  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
  if(!isProtected) return NextResponse.next();

  if(!token) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl)
  }
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.next();
  } catch(err) {
    console.error('Auth error', err.message);
    const response = NextResponse.redirect(new URL('/login', req.url))
    response.cookies.delete('jwt')
    return response
  }
  */
}

export const config = {
  matcher: [
    '/dashboard/:path*'
    // '/dashboard',      // so the base route is also protected
    // '/login',
    // '/signup',
  ],
};

