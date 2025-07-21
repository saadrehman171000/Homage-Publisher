import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

const ADMIN_EMAILS = [
  'saadrehman1710000@gmail.com',
  'rehan6205@gmail.com',
  // Add more admin emails here as needed
];

export async function middleware(req) {
  const { userId, sessionClaims } = getAuth(req);
  if (!userId || !sessionClaims?.email || !ADMIN_EMAILS.includes(sessionClaims.email)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
}; 