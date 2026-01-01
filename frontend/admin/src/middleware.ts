import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Get token from localStorage (client-side only)
    // This is a placeholder - actual auth check happens client-side
    const isLoginPage = request.nextUrl.pathname === '/login';
    const isPublicPath = isLoginPage || request.nextUrl.pathname.startsWith('/_next');

    // Allow public paths
    if (isPublicPath) {
        return NextResponse.next();
    }

    // For protected routes, let client-side auth handle it
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
