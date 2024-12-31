import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  //Fetch and store user

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // Protect dashboard and its subroutes
};
