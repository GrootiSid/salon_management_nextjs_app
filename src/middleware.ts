import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Protect /admin routes (except login)
    if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
        const token = request.cookies.get('admin_token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        // Optional: Verify token existence logic here if needed, but for now presence is the check
        // If we wanted to verify:
        // const payload = await verifyToken(token);
        // if (!payload) return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
