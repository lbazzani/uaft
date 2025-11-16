import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin-only routes
    if (path.startsWith('/admin')) {
      if (!token?.isAdmin) {
        return NextResponse.redirect(new URL('/mail/inbox', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Public routes
        if (path === '/' || path.startsWith('/login') || path.startsWith('/register')) {
          return true;
        }

        // Require authentication for /mail and /admin routes
        if (path.startsWith('/mail') || path.startsWith('/admin')) {
          return !!token;
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/mail/:path*', '/admin/:path*'],
};
