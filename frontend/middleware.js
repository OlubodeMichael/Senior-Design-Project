
import { NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/login', '/signup'];

export async function middleware(req) {
  
    const { pathname } = req.nextUrl;
  
    // ✅ Use correct cookie name
    const token = req.cookies.get('jwt')?.value;
  
    // Redirect logged-in users away from login/signup
    if (publicRoutes.includes(pathname)) {
      if (token) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.next();
    }
  
    // Only enforce auth on protected routes
    const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
    if (!isProtected) return NextResponse.next();
  
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
    

  }


export const config = {
    matcher: [
      '/dashboard/:path*',
      
    ]
  };
  